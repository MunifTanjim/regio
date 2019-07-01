const asyncHandler = require('express-async-handler')

const authorize = require('../helpers/authorize.js')

const { param } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const {
  models: { KV }
} = require('../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  param('key')
    .isString()
    .not()
    .isEmpty()
)

const handler = asyncHandler(async (req, res, next) => {
  const { key } = req.getData()

  let kv = await KV.findByPk(key)

  const data = kv ? kv.toJSON() : { key, value: '', description: '' }

  res.status(200).json({
    data
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
