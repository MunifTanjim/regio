const asyncHandler = require('express-async-handler')

const authorize = require('../../../helpers/authorize.js')

const { param, query } = require('express-validator/check')
const validationMiddleware = require('../../../helpers/validation-middleware.js')

const parseFieldsQuery = require('../../../helpers/parse-fields-query.js')
const parseFilterQuery = require('../../../helpers/parse-filter-query.js')
const formatModelData = require('../../../helpers/format-model-data.js')

const {
  models: { Term, TermCourseTeacher }
} = require('../../../../database/index.js')

const PERMITS = [true]

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

  const termCourseTeachers = await TermCourseTeacher.findAll({
    attributes: parseFieldsQuery(fields, [
      'TermId',
      'CourseId',
      'TeacherId',
      'section'
    ]),
    where: {
      ...parseFilterQuery(filter),
      TermId
    }
  })

  const items = termCourseTeachers.map(formatModelData)

  res.status(200).json({
    data: {
      kind: 'TermCourseTeacher',
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
