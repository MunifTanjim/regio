const asyncHandler = require('express-async-handler')

const authorize = require('../../helpers/authorize.js')

const { param, query } = require('express-validator/check')
const validationMiddleware = require('../../helpers/validation-middleware.js')

const parseFieldsQuery = require('../../helpers/parse-fields-query.js')
const parseFilterQuery = require('../../helpers/parse-filter-query.js')
const formatModelData = require('../../helpers/format-model-data.js')

const {
  models: { Term, TermCourse }
} = require('../../../database/index.js')

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

  const termcourses = await TermCourse.findAll({
    attributes: parseFieldsQuery(fields, ['TermId', 'CourseId']),
    where: {
      ...parseFilterQuery(filter),
      TermId
    }
  })

  if (!termcourses) {
    return res.status(404).json({
      error: {
        status: 404,
        message: 'not found'
      }
    })
  }

  const items = formatModelData(termcourses)

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
