const asyncHandler = require('express-async-handler')

const difference = require('lodash/difference')
const differenceBy = require('lodash/differenceBy')
const groupBy = require('lodash/groupBy')
const intersectionBy = require('lodash/intersectionBy')
const isPlainObject = require('lodash/isPlainObject')
const map = require('lodash/map')
const mapValues = require('lodash/mapValues')
const union = require('lodash/union')

const RegioError = require('../helpers/regio-error.js')

const authorize = require('../helpers/authorize.js')

const { body } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const parseSortQuery = require('../helpers/parse-sort-query.js')
const formatModelData = require('../helpers/format-model-data.js')
const getEntityIdFromUserId = require('../helpers/get-entity-id-from-user-id.js')

const {
  sequelize,
  models: { Batch, Routine, RoutineSlot, Term, TermCourse }
} = require('../../database/index.js')

const PERMITS = ['sysadmin', 'teacher']

const validDays = difference(Routine.validDays, ['FRI', 'SAT'])

const validators = validationMiddleware(
  body('TermId')
    .isInt()
    .toInt(),
  body('section').isIn(['A', 'B', 'C']),
  ...validDays.map(day => body(day).custom(o => isPlainObject(o)))
)

const handler = asyncHandler(async (req, res, next) => {
  const { TermId, section, ...routineDataObj } = req.getData()

  if (!req.grants.includes('sysadmin')) {
    const { UserId } = req.session.user

    if (req.grants.includes('teacher')) {
      const term = await Term.findByPk(TermId, { attributes: ['BatchId'] })
      if (!term) throw new RegioError(400, 'invalid term')

      const batch = await Batch.findByPk(term.BatchId, {
        attributes: ['coordinatorId']
      })

      if (batch.coordinatorId !== getEntityIdFromUserId(UserId)) {
        throw new RegioError(403, 'not authorized')
      }
    }
  }

  const validSlotIds = await RoutineSlot.findAll({
    attributes: ['RoutineSlotId'],
    order: parseSortQuery('+startTime')
  }).then(slots => slots.map(({ RoutineSlotId }) => RoutineSlotId))
  const slotIds = Object.values(routineDataObj)
    .reduce(
      (slotIds, dayDataObj) => union(slotIds, Object.keys(dayDataObj)),
      []
    )
    .map(Number)
  const invalidSlotIds = difference(slotIds, validSlotIds)
  if (invalidSlotIds.length) {
    throw new RegioError(400, `contains invalid slots`)
  }

  const validCourseIds = await TermCourse.findAll({
    attributes: ['CourseId'],
    where: { TermId }
  }).then(termcourses => map(termcourses, 'CourseId'))
  const CourseIds = Object.values(routineDataObj)
    .reduce(
      (slotIds, dayDataObj) => union(slotIds, Object.values(dayDataObj)),
      []
    )
    .filter(Boolean)
    .map(Number)
  const invalidCourseIds = difference(CourseIds, validCourseIds)
  if (invalidCourseIds.length) {
    throw new RegioError(400, `some courses does not exists in this term`)
  }

  const oldRoutines = await Routine.findAll({
    where: { TermId, section }
  })

  const oldRoutinesByDay = groupBy(oldRoutines, 'day')

  const newRoutinesByDay = Object.entries(routineDataObj).reduce(
    (byDay, [day, dayDataObj]) => {
      const RoutineSlotIdsByCourseId = mapValues(
        groupBy(
          Object.entries(dayDataObj)
            .filter(([_, CourseId]) => CourseId)
            .map(([slotId, CourseId]) => ({
              CourseId,
              slotId
            })),
          'CourseId'
        ),
        items => map(items, 'slotId').map(Number)
      )

      byDay[day] = Object.keys(RoutineSlotIdsByCourseId)
        .map(Number)
        .map(CourseId => ({
          TermId,
          section,
          day,
          CourseId,
          RoutineSlotIds: RoutineSlotIdsByCourseId[CourseId]
        }))

      return byDay
    },
    {}
  )

  const { count: totalItems, rows: routines } = await sequelize.transaction(
    async transaction => {
      for (const day of validDays) {
        const toDelete = differenceBy(
          oldRoutinesByDay[day],
          newRoutinesByDay[day],
          'CourseId'
        )
        const toUpdate = intersectionBy(
          oldRoutinesByDay[day],
          newRoutinesByDay[day],
          'CourseId'
        )
        const toInsert = differenceBy(
          newRoutinesByDay[day],
          oldRoutinesByDay[day],
          'CourseId'
        )

        const deleteOrUpdatePromises = [
          ...toDelete.map(item => item.destroy({ transaction })),
          ...toUpdate.map(item =>
            item.update(
              newRoutinesByDay[day].find(
                o => o.CourseId === item.get('CourseId')
              ),
              { transaction }
            )
          )
        ]

        await Promise.all(deleteOrUpdatePromises)

        if (toInsert.length) {
          await Routine.bulkCreate(toInsert, { transaction })
        }
      }

      return Routine.findAndCountAll({
        where: { TermId, section },
        transaction
      })
    }
  )

  const items = routines.map(formatModelData)

  res.status(200).json({
    data: {
      kind: 'Routine',
      items,
      totalItems
    },
    params: {
      TermId,
      section
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
