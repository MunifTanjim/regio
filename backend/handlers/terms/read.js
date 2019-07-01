const asyncHandler = require('express-async-handler')

const RegioError = require('../../libs/error/regio-error.js')

const authorize = require('../helpers/authorize.js')

const { param, query } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const parseFieldsQuery = require('../helpers/parse-fields-query.js')
const formatModelData = require('../helpers/format-model-data.js')

const {
  models: { Term }
} = require('../../database/index.js')

const PERMITS = [true]

const validators = validationMiddleware(
  param('TermId')
    .isInt()
    .withMessage('must be an integer'),
  query('fields')
    .optional()
    .isString()
    .withMessage('must be string')
)

const handler = asyncHandler(async (req, res, next) => {
  const { TermId, fields } = req.getData()

  const queryOptions = {
    attributes: parseFieldsQuery(fields)
  }

  const term = await Term.findByPk(TermId, queryOptions)

  if (!term) {
    throw new RegioError(404, 'not found')
  }

  const data = formatModelData(term)

  res.status(200).json({
    data
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
