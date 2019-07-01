const asyncHandler = require('express-async-handler')

const get = require('lodash/get')

const RegioError = require('../../../libs/error/regio-error.js')

const authorize = require('../../helpers/authorize.js')

const { param } = require('express-validator/check')
const validationMiddleware = require('../../helpers/validation-middleware.js')

const detectEntityModelFromUserId = require('../../helpers/detect-entity-model-from-user-id.js')
const getEntityIdFromUserId = require('../../helpers/get-entity-id-from-user-id.js')
const getModel = require('../../helpers/get-model.js')
const formatModelData = require('../../helpers/format-model-data.js')

const {
  sequelize,
  models: { ContactInfo, Person, User }
} = require('../../../database/index.js')

const PERMITS = [true]

const validators = validationMiddleware(
  param('UserId')
    .isString()
    .custom(UserId =>
      User.findByPk(UserId, { attributes: ['UserId'] }).then(user => {
        if (!user) throw new Error('does not exists')
      })
    ),
  param('ContactInfoId').isInt()
)

const handler = asyncHandler(async (req, res, next) => {
  const { UserId, ContactInfoId } = req.getData()

  if (!req.grants.includes('sysadmin')) {
    const { UserId: SessionUserId } = req.session.user
    if (SessionUserId !== UserId) {
      throw new RegioError(403, 'not authorized')
    }
  }

  const EntityModelName = detectEntityModelFromUserId(UserId)
  const EntityModel = getModel(EntityModelName)
  const EntityId = getEntityIdFromUserId(UserId)

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

  if (
    !entity ||
    !get(entity, 'User.Person.ContactInfos', [])
      .map(({ ContactInfoId }) => ContactInfoId)
      .includes(Number(ContactInfoId))
  ) {
    throw new RegioError(400, 'invalid request')
  }

  if (get(entity, 'User.Person.ContactInfos', []).length < 2) {
    throw new RegioError(400, 'only have 1 contact information')
  }

  await sequelize.transaction(async transaction => {
    await ContactInfo.destroy({ where: { ContactInfoId }, transaction })
    return entity.reload({ transaction })
  })

  const data = formatModelData(entity)

  delete data.User.password

  res.status(200).json({
    data
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
