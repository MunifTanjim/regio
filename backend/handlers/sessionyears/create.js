const asyncHandler = require('express-async-handler')

const authorize = require('../helpers/authorize.js')

const { body } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const formatModelData = require('../helpers/format-model-data.js')

const {
  models: { SessionYear }
} = require('../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  body('id')
    .isString()
    .matches(/^\d{4}-\d{4}$/)
    .custom(id => {
      const [start, end] = id.split('-').map(Number)
      return end === start + 1
    })
    .custom(id =>
      SessionYear.findByPk(id).then(sessionyear => {
        if (sessionyear) throw new Error('already exists')
      })
    )
)

const handler = asyncHandler(async (req, res, next) => {
  const { id: SessionYearId } = req.getData()

  const queryOptions = {}

  const sessionyear = await SessionYear.create({ SessionYearId }, queryOptions)

  res.status(200).json({
    data: formatModelData(sessionyear)
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
