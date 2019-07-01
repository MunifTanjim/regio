const asyncHandler = require('express-async-handler')

const map = require('lodash/map')

const authorize = require('../../helpers/authorize.js')

const RegioError = require('../../../libs/error/regio-error.js')

const { param } = require('express-validator/check')
const validationMiddleware = require('../../helpers/validation-middleware.js')

const { hashPassword } = require('../../../libs/securepassword.js')

const { User } = require('../../../database/index.js').models

function getRandomPassword(length) {
  const str =
    'qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM1234567890!@#$%^&*'
  let password = ''

  for (let i = 0; i < length; i++) {
    password = password + str.charAt(parseInt(Math.random() * str.length))
  }

  return password
}

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  param('UserId')
    .isString()
    .custom(UserId =>
      User.findByPk(UserId, { attributes: ['UserId'] }).then(user => {
        if (!user) throw new Error('does not exists')
      })
    )
)

const handler = asyncHandler(async (req, res, next) => {
  const { UserId } = req.getData()

  const user = await User.findByPk(UserId)

  if (map(user.Roles, 'RoleId').includes('sysadmin')) {
    throw new RegioError(403, 'not authorized')
  }

  const password = getRandomPassword(12)
  const hashedPassword = await hashPassword(password)

  await user.update({ password: hashedPassword })

  res.status(200).json({
    data: { password }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
