const asyncHandler = require('express-async-handler')

const authorize = require('../helpers/authorize.js')

const RegioError = require('../helpers/regio-error.js')

const { body, param } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const formatModelData = require('../helpers/format-model-data.js')

const {
  models: { Batch, Teacher }
} = require('../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  param('BatchId')
    .isInt()
    .withMessage('must be an integer')
    .toInt(),
  body('coordinatorId')
    .isInt()
    .toInt()
    .custom(id =>
      Teacher.findByPk(id, { attributes: ['TeacherId'] }).then(teacher => {
        if (!teacher) throw new Error('does not exist')
      })
    )
)

const handler = asyncHandler(async (req, res, next) => {
  const { BatchId, coordinatorId } = req.getData()

  const batch = await Batch.findByPk(BatchId)

  if (!batch) {
    throw new RegioError(404, 'not found')
  }

  await batch.update({ coordinatorId })

  const data = formatModelData(batch)

  res.status(200).json({
    data
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
