const asyncHandler = require('express-async-handler')

const authorize = require('../../helpers/authorize.js')

const { param, query } = require('express-validator/check')
const validationMiddleware = require('../../helpers/validation-middleware.js')

const parseFieldsQuery = require('../../helpers/parse-fields-query.js')
const parseFilterQuery = require('../../helpers/parse-filter-query.js')
const parseSortQuery = require('../../helpers/parse-sort-query.js')
const formatModelData = require('../../helpers/format-model-data.js')

const {
  models: { Routine }
} = require('../../../database/index.js')

const PERMITS = [true]

const validators = validationMiddleware(
  param('TermId').isInt(),
  query('fields')
    .optional()
    .isString()
    .withMessage('must be string'),
  query('filter')
    .optional()
    .isString()
    .withMessage('must be string'),
  query('sort')
    .optional()
    .isString()
    .withMessage('must be string')
)

const handler = asyncHandler(async (req, res, next) => {
  const { TermId, fields, filter, sort } = req.getData()

  const queryOptions = {
    attributes: parseFieldsQuery(fields),
    order: parseSortQuery(sort),
    where: {
      ...parseFilterQuery(filter),
      TermId
    }
  }

  const { count: totalItems, rows: routines } = await Routine.findAndCountAll(
    queryOptions
  )

  const items = routines.map(formatModelData)

  res.status(200).json({
    data: {
      kind: 'Routine',
      items,
      totalItems
    },
    params: {
      TermId
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
