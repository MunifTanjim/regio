const asyncHandler = require('express-async-handler')

const RegioError = require('../../libs/error/regio-error.js')

const authorize = require('../helpers/authorize.js')

const { param } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const {
  Sequelize,
  models: { SessionYear }
} = require('../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  param('id')
    .isString()
    .not()
    .isEmpty()
    .custom(id =>
      SessionYear.findByPk(id).then(sessionyear => {
        if (!sessionyear) throw new Error('does not exists')
      })
    )
)

const handler = asyncHandler(async (req, res, next) => {
  const { id } = req.getData()

  const queryOptions = {
    attributes: {
      include: [
        [Sequelize.fn('COUNT', Sequelize.col('Terms.TermId')), 'totalTerms']
      ]
    },
    group: ['SessionYear.SessionYearId'],
    include: [
      {
        association: SessionYear.Terms,
        attributes: []
      }
    ]
  }

  const sessionyear = await SessionYear.findByPk(id, queryOptions)

  if (Number(sessionyear.get('totalTerms'))) {
    throw new RegioError(405, 'not allowed')
  }

  await sessionyear.destroy()

  res.status(204).json({
    data: null
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
