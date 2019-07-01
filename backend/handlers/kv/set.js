const asyncHandler = require('express-async-handler')

const authorize = require('../helpers/authorize.js')

const { body, param } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const {
  models: { KV }
} = require('../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  param('key')
    .isString()
    .not()
    .isEmpty(),
  body('value').isString(),
  body('description')
    .isString()
    .optional({ checkFalsy: true, nullable: true })
)

const handler = asyncHandler(async (req, res, next) => {
  const { key, value, description } = req.getData()

  let kv = await KV.findByPk(key)

  if (kv) {
    await kv.update({ value, description })
  } else {
    kv = await KV.create({ key, value, description })
  }

  const data = kv.toJSON()

  res.status(200).json({
    data
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
