const asyncHandler = require('express-async-handler')

const authorize = require('../helpers/authorize.js')

const { param, query } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const parseFieldsQuery = require('../helpers/parse-fields-query.js')
const formatModelData = require('../helpers/format-model-data.js')

const {
  models: { Country }
} = require('../../database/index.js')

const PERMITS = [null]

const validators = validationMiddleware(
  param('CountryId').isInt(),
  query('fields')
    .optional()
    .isString()
    .withMessage('must be string')
)

const handler = asyncHandler(async (req, res, next) => {
  const { CountryId, fields } = req.getData()

  const country = await Country.findByPk(CountryId, {
    attributes: parseFieldsQuery(fields, ['CountryId'])
  })

  const data = formatModelData(country)

  res.status(200).json({
    data
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
