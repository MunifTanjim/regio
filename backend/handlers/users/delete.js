const asyncHandler = require('express-async-handler')

const RegioError = require('../../libs/error/regio-error.js')

const authorize = require('../helpers/authorize.js')

const { param } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const {
  models: { User }
} = require('../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  param('UserId')
    .isString()
    .withMessage('must be an integer')
)

const handler = asyncHandler(async (req, res, next) => {
  const { UserId } = req.getData()

  const user = await User.findByPk(UserId, {
    include: [{ association: User.Person, attributes: ['PersonId'] }]
  })

  if (!user) {
    throw new RegioError(404, 'not found')
  }

  if (user.get('approved')) {
    throw new RegioError(400, 'already approved')
  }

  await user.Person.destroy()

  res.status(204).json({
    data: null
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
