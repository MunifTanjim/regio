const asyncHandler = require('express-async-handler')

const RegioError = require('../../libs/error/regio-error.js')

const authorize = require('../helpers/authorize.js')

const { body } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const formatModelData = require('../helpers/format-model-data.js')

const {
  models: { SessionYear, Batch, Term }
} = require('../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  body('SessionYearId')
    .isString()
    .matches(/^\d{4}-\d{4}$/)
    .custom(id => {
      const [start, end] = id.split('-').map(Number)
      return end === start + 1
    })
    .custom(id =>
      SessionYear.findByPk(id).then(sessionyear => {
        if (!sessionyear) throw new Error('does not exist')
      })
    ),
  body('BatchId')
    .isInt()
    .toInt()
    .custom(id =>
      Batch.findByPk(id, { attributes: ['BatchId'] }).then(batch => {
        if (!batch) throw new Error('does not exist')
      })
    ),
  body('level').isIn(['1', '2', '3', '4']),
  body('term').isIn(['1', '2'])
)

const handler = asyncHandler(async (req, res, next) => {
  const { SessionYearId, BatchId, level, term } = req.getData()

  const queryOptions = {}

  const termExists = await Term.findOne({
    where: { SessionYearId, BatchId, level, term }
  })

  if (termExists) {
    throw new RegioError(400, 'already exists')
  }

  const termModel = await Term.create(
    { SessionYearId, BatchId, level, term },
    queryOptions
  )

  const data = formatModelData(termModel)

  res.status(200).json({
    data
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
