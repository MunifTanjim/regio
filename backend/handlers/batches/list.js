const asyncHandler = require('express-async-handler')
const cloneDeep = require('lodash/cloneDeep')
const qs = require('qs')

const authorize = require('../helpers/authorize.js')

const { query } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const parseFieldsQuery = require('../helpers/parse-fields-query.js')
const parseFilterQuery = require('../helpers/parse-filter-query.js')
const parseSortQuery = require('../helpers/parse-sort-query.js')
const formatModelData = require('../helpers/format-model-data.js')

const {
  models: { Batch }
} = require('../../database/index.js')

const PERMITS = [null]

const validators = validationMiddleware(
  query('length')
    .optional()
    .isInt({ min: 1 })
    .withMessage('must be an integer greater than 0')
    .toInt(),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('must be an integer greater than 0')
    .toInt(),
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
  const {
    length: itemsPerPage = 5,
    page: pageIndex = 1,
    fields,
    filter,
    sort
  } = req.getData()

  const queryOptions = {
    attributes: parseFieldsQuery(fields, ['BatchId']),
    limit: itemsPerPage + 1,
    offset: (pageIndex - 1) * itemsPerPage,
    order: parseSortQuery(sort, '-BatchId'),
    where: parseFilterQuery(filter)
  }

  const { count: totalItems, rows: batches } = await Batch.findAndCountAll(
    queryOptions
  )

  const items = batches.map(formatModelData)

  let nextLink
  if (items.length > itemsPerPage) {
    items.pop()

    const query = cloneDeep(req.query)
    query.page = pageIndex + 1
    nextLink = `${req.baseUrl}?${qs.stringify(query, {
      arrayFormat: 'comma'
    })}`
  }

  res.status(200).json({
    data: {
      kind: 'Batch',
      items,
      itemsPerPage,
      nextLink,
      pageIndex,
      totalItems,
      totalPages: Math.ceil(totalItems / itemsPerPage)
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
