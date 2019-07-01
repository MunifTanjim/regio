const asyncHandler = require('express-async-handler')

const difference = require('lodash/difference')
const differenceBy = require('lodash/differenceBy')
const groupBy = require('lodash/groupBy')
const intersectionBy = require('lodash/intersectionBy')
const isPlainObject = require('lodash/isPlainObject')
const union = require('lodash/union')

const RegioError = require('../helpers/regio-error.js')

const authorize = require('../helpers/authorize.js')

const { body } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const formatModelData = require('../helpers/format-model-data.js')
const getEntityIdFromUserId = require('../helpers/get-entity-id-from-user-id.js')

const {
  sequelize,
  models: { Batch, WeekPlan, Term }
} = require('../../database/index.js')

const PERMITS = ['sysadmin', 'teacher']

const validDays = difference(WeekPlan.validDays, ['FRI', 'SAT'])
const validWeekNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

const validators = validationMiddleware(
  body('TermId')
    .isInt()
    .toInt(),
  body('section').isIn(['A', 'B', 'C']),
  ...validDays.map(day => body(day).custom(o => isPlainObject(o)))
)

const handler = asyncHandler(async (req, res, next) => {
  const { TermId, section, ...weekPlanDataObj } = req.getData()

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

  const weekNumbers = Object.values(weekPlanDataObj)
    .reduce(
      (weekNumbers, dayDataObj) => union(weekNumbers, Object.keys(dayDataObj)),
      []
    )
    .map(Number)
  const invalidWeekNumbers = difference(weekNumbers, validWeekNumbers)
  if (invalidWeekNumbers.length) {
    throw new RegioError(400, `contains invalid week numbers`)
  }

  const oldRoutines = await WeekPlan.findAll({
    where: { TermId, section }
  })

  const oldWeekPlansByDay = groupBy(oldRoutines, 'day')

  const newWeekPlansByDay = Object.entries(weekPlanDataObj).reduce(
    (byDay, [day, dayDataObj]) => {
      byDay[day] = Object.entries(dayDataObj)
        .filter(([_, note]) => note)
        .map(([weekNumber, note]) => ({
          TermId,
          section,
          weekNumber: Number(weekNumber),
          day,
          note
        }))

      return byDay
    },
    {}
  )

  const { count: totalItems, rows: weekPlans } = await sequelize.transaction(
    async transaction => {
      for (const day of validDays) {
        const toDelete = differenceBy(
          oldWeekPlansByDay[day],
          newWeekPlansByDay[day],
          'note'
        )
        const toUpdate = intersectionBy(
          oldWeekPlansByDay[day],
          newWeekPlansByDay[day],
          'note'
        )
        const toInsert = differenceBy(
          newWeekPlansByDay[day],
          oldWeekPlansByDay[day],
          'note'
        )

        const deleteOrUpdatePromises = [
          ...toDelete.map(item => item.destroy({ transaction })),
          ...toUpdate.map(item =>
            item.update(
              newWeekPlansByDay[day].find(
                o => o.weekNumber === item.get('weekNumber')
              ),
              { transaction }
            )
          )
        ]

        await Promise.all(deleteOrUpdatePromises)

        if (toInsert.length) {
          await WeekPlan.bulkCreate(toInsert, { transaction })
        }
      }

      return WeekPlan.findAndCountAll({
        where: { TermId, section },
        transaction
      })
    }
  )

  const items = weekPlans.map(formatModelData)

  res.status(200).json({
    data: {
      kind: 'WeekPlan',
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
