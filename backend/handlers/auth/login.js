const asyncHandler = require('express-async-handler')
const set = require('lodash/set')

const RegioError = require('../../libs/error/regio-error.js')

const { body } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const { verifyPassword } = require('../../libs/securepassword.js')

const detectEntityModelFromUserId = require('../helpers/detect-entity-model-from-user-id.js')
const getEntityIdFromUserId = require('../helpers/get-entity-id-from-user-id.js')
const getModel = require('../helpers/get-model.js')
const formatModelData = require('../helpers/format-model-data.js')

const { Person, User } = require('../../database/index.js').models

const validators = validationMiddleware(
  body('UserId')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Invalid UserID'),
  body('password')
    .isString()
    .not()
    .isEmpty()
    .withMessage('Missing Password')
)

const handler = asyncHandler(async (req, res, next) => {
  const { UserId, password } = req.getData()

  const user = await User.findByPk(UserId, {
    attributes: ['UserId', 'password', 'approved']
  })

  if (!user) {
    throw new RegioError(401, 'Incorrect Login Credential!')
  }

  if (!user.approved) {
    throw new RegioError(401, 'Needs Approval!')
  }

  const verified = await verifyPassword(user, password)

  if (!verified) {
    throw new RegioError(401, 'Incorrect Login Credential!')
  }

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
                association: Person.ContactInfos
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

  const data = formatModelData(entity)

  set(req.session, 'user', {
    UserId,
    Roles: data.User.Roles.map(role => role.id)
  })

  req.session.save(err => {
    if (err) next(err)

    delete data.User.password

    res.status(200).json({ data })
  })
})

module.exports.handler = validators.concat(handler)
