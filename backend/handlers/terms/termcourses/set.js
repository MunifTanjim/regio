const asyncHandler = require('express-async-handler')

const isPlainObject = require('lodash/isPlainObject')
const differenceBy = require('lodash/differenceBy')
const intersectionBy = require('lodash/intersectionBy')

const authorize = require('../../helpers/authorize.js')

const { isInt } = require('validator')
const { body, param } = require('express-validator/check')
const validationMiddleware = require('../../helpers/validation-middleware.js')

const formatModelData = require('../../helpers/format-model-data.js')

const {
  sequelize,
  models: { Term, TermCourse }
} = require('../../../database/index.js')

const isValidTermCourseObject = (o, i) => {
  if (!isPlainObject(o)) throw new Error(`invalid termcourses[${i}] type`)

  const { CourseId } = o

  if (!isInt(String(CourseId))) {
    throw new Error(`invalid termcourses[${i}].CourseId: ${CourseId}`)
  }

  return true
}

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  param('TermId')
    .isInt()
    .custom(id =>
      Term.findByPk(id).then(term => {
        if (!term) throw new Error('does not exists')
      })
    ),
  body('startDate').isISO8601(),
  body('endDate')
    .optional({ nullable: true })
    .isISO8601(),
  body('termcourses')
    .isArray()
    .custom(termcourses => {
      return termcourses.reduce(
        (valid, item, index) => valid && isValidTermCourseObject(item, index),
        true
      )
    })
)

const handler = asyncHandler(async (req, res, next) => {
  const { TermId, startDate, endDate = null, termcourses } = req.getData()

  const oldTermCourses = await TermCourse.findAll({
    where: { TermId }
  })

  const newTermCourses = termcourses.map(({ CourseId }) => ({
    TermId: Number(TermId),
    CourseId: Number(CourseId),
    startDate,
    endDate
  }))

  const toDelete = differenceBy(oldTermCourses, newTermCourses, 'CourseId')
  const toUpdate = intersectionBy(oldTermCourses, newTermCourses, 'CourseId')
  const toInsert = differenceBy(newTermCourses, oldTermCourses, 'CourseId')

  const termCourses = await sequelize.transaction(async transaction => {
    const promisesToDelete = toDelete.map(item => item.destroy({ transaction }))

    await Promise.all(promisesToDelete)

    const promisesToUpdate = toUpdate.map(item =>
      item.update(
        newTermCourses.find(o => o.CourseId === item.get('CourseId')),
        { transaction }
      )
    )

    await Promise.all(promisesToUpdate)

    if (toInsert.length) {
      await TermCourse.bulkCreate(toInsert, { transaction })
    }

    return TermCourse.findAll({ where: { TermId }, transaction })
  })

  const items = formatModelData(termCourses)

  res.status(200).json({
    data: {
      kind: 'TermCourse',
      items,
      totalItems: items.length
    },
    params: {
      TermId
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
