const asyncHandler = require('express-async-handler')

const get = require('lodash/get')
const pick = require('lodash/pick')
const isPlainObject = require('lodash/isPlainObject')

const isBdMobile = require('@muniftanjim/is-mobile-phone-number-bd').default

const RegioError = require('../../../libs/error/regio-error.js')

const authorize = require('../../helpers/authorize.js')

const { normalizeEmail } = require('validator')
const { body, param } = require('express-validator/check')
const validationMiddleware = require('../../helpers/validation-middleware.js')

const detectEntityModelFromUserId = require('../../helpers/detect-entity-model-from-user-id.js')
const getEntityIdFromUserId = require('../../helpers/get-entity-id-from-user-id.js')
const getModel = require('../../helpers/get-model.js')
const formatModelData = require('../../helpers/format-model-data.js')

const {
  sequelize,
  models: { ContactInfo, Country, Person, User }
} = require('../../../database/index.js')

const PERMITS = [true]

const isValidTypeItem = typeItem => ContactInfo.validTypes.includes(typeItem)

const validateAddressObject = async o => {
  const errors = []

  const requiredParams = ['line1', 'line2', 'city', 'postalCode']
  const optionalParams = ['line3', 'region']

  for (const [key, value] of Object.entries(pick(o, requiredParams))) {
    if (typeof value !== 'string' || !value) {
      errors.push({ param: `address.${key}`, message: `required` })
    }
  }

  for (const [key, value] of Object.entries(pick(o, optionalParams))) {
    if (value !== null && !['string', 'undefined'].includes(typeof value)) {
      errors.push({ param: `address.${key}`, message: `invalid value` })
    }
  }

  const country = await Country.findByPk(get(o, 'CountryId'))
  if (!country) {
    errors.push({ param: `address.CountryId`, message: `does not exists` })
  }

  if (errors.length) throw new RegioError(400, 'validation error', errors)
}

const validators = validationMiddleware(
  param('UserId')
    .isString()
    .custom(UserId =>
      User.findByPk(UserId, { attributes: ['UserId'] }).then(user => {
        if (!user) throw new Error('does not exists')
      })
    ),
  body('type').custom(
    type => Array.isArray(type) && type.every(isValidTypeItem)
  ),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail(),
  body('mobile')
    .optional({ checkFalsy: true })
    .custom(mobile => isBdMobile(mobile)),
  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^(\+?88)?0[\d\-()]+$/),
  body('address')
    .optional({ checkFalsy: true })
    .custom(isPlainObject)
)

const handler = asyncHandler(async (req, res, next) => {
  const { UserId, type, email, mobile, phone, address } = req.getData()

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

  if (!entity) {
    throw new RegioError(400, 'invalid request')
  }

  if (get(entity, 'User.Person.ContactInfos', []).length >= 2) {
    throw new RegioError(400, 'already have 2 contact information')
  }

  const queryData = {
    PersonId: get(entity, 'User.PersonId'),
    type,
    email: email ? normalizeEmail(email) : email,
    mobile,
    phone
  }

  const queryOptions = {}

  if (address) {
    await validateAddressObject(address)
    queryData.Address = address
    queryOptions.include = [{ association: ContactInfo.Address }]
  }

  await sequelize.transaction(async transaction => {
    await ContactInfo.create(queryData, queryOptions)
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
