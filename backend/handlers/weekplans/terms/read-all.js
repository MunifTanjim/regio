const asyncHandler = require('express-async-handler')

const authorize = require('../../helpers/authorize.js')

const { param, query } = require('express-validator/check')
const validationMiddleware = require('../../helpers/validation-middleware.js')

const parseFilterQuery = require('../../helpers/parse-filter-query.js')
const formatModelData = require('../../helpers/format-model-data.js')

const {
  models: { WeekPlan }
} = require('../../../database/index.js')

const PERMITS = [true]

const validators = validationMiddleware(
  param('TermId')
    .isInt()
    .toInt(),
  query('filter')
    .optional()
    .isString()
    .withMessage('must be string')
)

const handler = asyncHandler(async (req, res, next) => {
  const { TermId, filter } = req.getData()

  const queryOptions = {
    where: {
      ...parseFilterQuery(filter),
      TermId
    }
  }

  const { count: totalItems, rows: weekPlans } = await WeekPlan.findAndCountAll(
    queryOptions
  )

  const items = weekPlans.map(formatModelData)

  res.status(200).json({
    data: {
      kind: 'WeekPlan',
      items,
      totalItems
    },
    params: {
      TermId
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
