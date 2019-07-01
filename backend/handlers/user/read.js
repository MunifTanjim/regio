const asyncHandler = require('express-async-handler')

const authorize = require('../helpers/authorize.js')

const detectEntityModelFromUserId = require('../helpers/detect-entity-model-from-user-id.js')
const getEntityIdFromUserId = require('../helpers/get-entity-id-from-user-id.js')
const getModel = require('../helpers/get-model.js')
const formatModelData = require('../helpers/format-model-data.js')

const { ContactInfo, Person, User } = require('../../database/index.js').models

const PERMITS = [true]

const handler = asyncHandler(async (req, res, next) => {
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

  const data = formatModelData(entity)

  delete data.User.password

  res.status(200).json({
    data
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = [].concat(handler)
