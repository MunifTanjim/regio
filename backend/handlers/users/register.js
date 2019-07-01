const asyncHandler = require('express-async-handler')
const capitalize = require('lodash/capitalize')
const toLower = require('lodash/toLower')

const authorize = require('../helpers/authorize.js')

const { body, oneOf } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const { hashPassword } = require('../../libs/securepassword.js')

const {
  ranks: teacherRanks
} = require('../../database/helpers/models/teacher.js')

const getModel = require('../helpers/get-model.js')
const getEntityIdFromUserId = require('../helpers/get-entity-id-from-user-id.js')
const getModelPrimaryKeyField = require('../helpers/get-model-primary-key-field.js')

const { Batch, Person, User, sequelize } = require('../../database/index.js')

const PERMITS = [null]

const validators = validationMiddleware(
  oneOf(
    [
      [body('type').equals('student'), body('BatchId').exists()],
      [body('type').equals('teacher'), body('rank').exists()]
    ],
    'missing required fields'
  ),
  body('type')
    .isIn(['student', 'teacher'])
    .withMessage('invalid value'),
  body('UserId')
    .isString()
    .matches(/^[A-Z]{0,2}\d+$/)
    .custom(UserId =>
      User.findByPk(UserId, { attributes: ['UserId'] }).then(user => {
        if (user) throw new Error('already registered')
      })
    ),
  body('firstName')
    .isString()
    .not()
    .isEmpty(),
  body('middleName')
    .optional({ checkFalsy: true, nullable: true })
    .isString(),
  body('lastName')
    .isString()
    .not()
    .isEmpty(),
  body('dob').isISO8601(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters long'),
  body('passwordConfirmation').custom((passwordConfirmation, { req }) => {
    if (passwordConfirmation === req.body.password) return true
    throw new Error('password confirmation does not match password')
  }),
  body('BatchId')
    .optional()
    .isInt()
    .custom(BatchId =>
      Batch.findByPk(BatchId, { attributes: ['BatchId'] }).then(batch => {
        if (!batch) throw new Error('invalid value')
      })
    ),
  body('rank')
    .optional()
    .isIn(teacherRanks),
  body('email')
    .isEmail()
    .normalizeEmail(),
  body('mobile')
    .isString()
    .not()
    .isEmpty(),
  body('phone')
    .optional({ checkFalsy: true, nullable: true })
    .isString()
    .not()
    .isEmpty()
)

const handler = asyncHandler(async (req, res, next) => {
  try {
    const {
      type,
      firstName,
      middleName,
      lastName,
      dob,
      UserId,
      password,
      BatchId,
      rank,
      email,
      mobile,
      phone
    } = req.getData()

    const EntityModel = getModel(capitalize(type))
    const pkField = getModelPrimaryKeyField(EntityModel)

    const RoleId = toLower(type)
    const Roles = [RoleId]

    const queryData = {
      [pkField]: getEntityIdFromUserId(UserId),
      User: {
        UserId,
        password: await hashPassword(password),
        Person: {
          firstName,
          middleName,
          lastName,
          dob,
          ContactInfos: [
            {
              type: ['current', 'personal'],
              email,
              mobile,
              phone
            }
          ]
        }
      }
    }

    switch (toLower(type)) {
      case 'student':
        queryData.BatchId = BatchId
        break
      case 'teacher':
        queryData.rank = rank
        break
    }

    const queryOptions = {
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
            }
          ]
        }
      ]
    }

    const data = await sequelize.transaction(async transaction => {
      queryOptions.transaction = transaction

      const entity = await EntityModel.create(queryData, queryOptions)

      await entity.User.setRoles(Roles, { transaction })

      const data = entity.toJSON()

      data.User.Roles = Roles

      return data
    })

    delete data.User.password

    res.status(200).json({
      data
    })
  } catch (err) {
    throw err
  }
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
