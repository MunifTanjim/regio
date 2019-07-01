const asyncHandler = require('express-async-handler')

const authorize = require('../helpers/authorize.js')

const { body } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const formatModelData = require('../helpers/format-model-data.js')

const {
  models: { Batch, Teacher }
} = require('../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  body('BatchId')
    .isInt()
    .withMessage('must be an integer')
    .toInt()
    .custom(id =>
      Batch.findByPk(id, { attributes: ['BatchId'] }).then(batch => {
        if (batch) throw new Error('already exists')
      })
    ),
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

  const queryOptions = {}

  const batch = await Batch.create({ BatchId, coordinatorId }, queryOptions)

  res.status(200).json({
    data: formatModelData(batch)
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
