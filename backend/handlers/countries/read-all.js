const asyncHandler = require('express-async-handler')

const authorize = require('../helpers/authorize.js')

const { query } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const parseFieldsQuery = require('../helpers/parse-fields-query.js')
const parseFilterQuery = require('../helpers/parse-filter-query.js')
const parseSortQuery = require('../helpers/parse-sort-query.js')
const formatModelData = require('../helpers/format-model-data.js')

const {
  models: { Country }
} = require('../../database/index.js')

const PERMITS = [null]

const validators = validationMiddleware(
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
  const { fields, filter, sort } = req.getData()

  const queryOptions = {
    attributes: parseFieldsQuery(fields, ['CountryId']),
    order: parseSortQuery(sort),
    where: parseFilterQuery(filter)
  }

  const { count: totalItems, rows: countries } = await Country.findAndCountAll(
    queryOptions
  )

  const items = countries.map(formatModelData)

  res.status(200).json({
    data: {
      kind: 'Country',
      items,
      totalItems
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
