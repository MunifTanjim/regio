const asyncHandler = require('express-async-handler')

const map = require('lodash/map')

const authorize = require('../../helpers/authorize.js')

const { param, query } = require('express-validator/check')
const validationMiddleware = require('../../helpers/validation-middleware.js')

const parseFieldsQuery = require('../../helpers/parse-fields-query.js')
const parseFilterQuery = require('../../helpers/parse-filter-query.js')
const formatModelData = require('../../helpers/format-model-data.js')

const {
  Sequelize: { Op },
  models: { Course, Term, TermCourse }
} = require('../../../database/index.js')

const PERMITS = ['sysadmin', 'head', 'teacher', 'student']

const validators = validationMiddleware(
  param('TermId')
    .isInt()
    .custom(id =>
      Term.findByPk(id, { attributes: ['TermId'] }).then(term => {
        if (!term) throw new Error('does not exist')
      })
    ),
  query('fields')
    .optional()
    .isString()
    .withMessage('must be string'),
  query('filter')
    .optional()
    .isString()
    .withMessage('must be string')
)

const handler = asyncHandler(async (req, res, next) => {
  const { TermId, fields, filter } = req.getData()

  const CourseIds = await TermCourse.findAll({
    attributes: ['CourseId'],
    where: { TermId }
  }).then(termcourses => map(termcourses, 'CourseId'))

  const queryOptions = {
    attributes: parseFieldsQuery(fields, ['CourseId']),
    where: {
      ...parseFilterQuery(filter),
      CourseId: { [Op.in]: CourseIds }
    }
  }

  const courses = await Course.findAll(queryOptions)

  const items = formatModelData(courses)

  res.status(200).json({
    data: {
      kind: 'Course',
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
