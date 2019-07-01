const asyncHandler = require('express-async-handler')

const RegioError = require('../../libs/error/regio-error.js')

const authorize = require('../helpers/authorize.js')

const { param, query } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const parseFieldsQuery = require('../helpers/parse-fields-query.js')
const formatModelData = require('../helpers/format-model-data.js')

const {
  models: { SessionYear }
} = require('../../database/index.js')

const PERMITS = [null]

const validators = validationMiddleware(
  param('id')
    .isInt()
    .withMessage('must be an integer'),
  query('fields')
    .optional()
    .isString()
    .withMessage('must be string')
)

const handler = asyncHandler(async (req, res, next) => {
  const { id, fields } = req.getData()

  const queryOptions = {
    attributes: parseFieldsQuery(fields)
  }

  const sessionyear = await SessionYear.findByPk(id, queryOptions)

  if (!sessionyear) {
    throw new RegioError(404, 'not found')
  }

  res.status(200).json({
    data: formatModelData(sessionyear)
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
