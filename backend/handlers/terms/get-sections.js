const asyncHandler = require('express-async-handler')

const authorize = require('../helpers/authorize.js')

const { param } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const {
  models: { Enrollment }
} = require('../../database/index.js')

const PERMITS = [true]

const validators = validationMiddleware(
  param('TermId')
    .isInt()
    .withMessage('must be an integer')
)

const handler = asyncHandler(async (req, res, next) => {
  const { TermId } = req.getData()

  const results = await Enrollment.count({
    attributes: ['section'],
    distinct: true,
    col: ['section'],
    group: ['section'],
    where: { TermId }
  })

  const sections = results.map(({ section }) => section)

  res.status(200).json({
    data: {
      items: sections
    },
    params: {
      TermId
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
