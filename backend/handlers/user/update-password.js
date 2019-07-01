const asyncHandler = require('express-async-handler')

const authorize = require('../helpers/authorize.js')

const { body } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const { hashPassword, verifyPassword } = require('../../libs/securepassword.js')

const detectEntityModelFromUserId = require('../helpers/detect-entity-model-from-user-id.js')
const getEntityIdFromUserId = require('../helpers/get-entity-id-from-user-id.js')
const getModel = require('../helpers/get-model.js')
const formatModelData = require('../helpers/format-model-data.js')

const { ContactInfo, Person, User } = require('../../database/index.js').models

const PERMITS = [true]

const validators = validationMiddleware(
  body('currentPassword')
    .isString()
    .not()
    .isEmpty()
    .custom((currentPassword, { req }) =>
      User.findByPk(req.session.user.UserId, {
        attributes: ['password']
      })
        .then(user => verifyPassword(user, currentPassword))
        .then(verified => {
          if (!verified) throw new Error('incorrect current password')
        })
    ),
  body('password')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long'),
  body('passwordConfirmation').custom((passwordConfirmation, { req }) => {
    if (passwordConfirmation === req.body.password) return true
    throw new Error('password confirmation does not match password')
  })
)

const handler = asyncHandler(async (req, res, next) => {
  const { password } = req.getData()

  const UserId = req.session.user.UserId
  const EntityId = getEntityIdFromUserId(UserId)

  const EntityModelName = detectEntityModelFromUserId(UserId)
  const EntityModel = getModel(EntityModelName)

  const entity = await EntityModel.findByPk(EntityId, {
    include: [
      {
        association: EntityModel.User,
        include: [
          {
            association: User.Person,
            include: [
              {
                association: Person.ContactInfos,
                include: [
                  {
                    association: ContactInfo.Address
                  }
                ]
              }
            ]
          },
          {
            association: User.Roles
          }
        ]
      }
    ]
  })

  const hashedPassword = await hashPassword(password)

  await entity.User.update({ password: hashedPassword })

  const data = formatModelData(entity)

  delete data.User.password

  res.status(200).json({
    data
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
