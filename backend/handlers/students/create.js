const asyncHandler = require('express-async-handler')

const authorize = require('../helpers/authorize.js')

const { body } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const { hashPassword } = require('../../libs/securepassword.js')

const getEntityIdFromUserId = require('../helpers/get-entity-id-from-user-id.js')
const formatModelData = require('../helpers/format-model-data.js')

const {
  models: { Batch, Person, User, Student, ContactInfo },
  sequelize
} = require('../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  body('UserId')
    .isString()
    .matches(/^\d+$/)
    .custom(UserId =>
      User.findByPk(UserId, { attributes: ['UserId'] }).then(user => {
        if (user) throw new Error('already exists')
      })
    ),
  body('firstName')
    .isString()
    .not()
    .isEmpty(),
  body('middleName')
    .optional({ nullable: true })
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
    .isInt()
    .toInt()
    .custom(BatchId =>
      Batch.findByPk(BatchId, { attributes: ['BatchId'] }).then(batch => {
        if (!batch) throw new Error('invalid value')
      })
    ),
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
  const {
    firstName,
    middleName,
    lastName,
    dob,
    UserId,
    password,
    BatchId,
    email,
    mobile,
    phone
  } = req.getData()

  const RoleId = 'student'
  const Roles = [RoleId]

  const queryData = {
    StudentId: getEntityIdFromUserId(UserId),
    BatchId,
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

  const queryOptions = {
    include: [
      {
        association: Student.User,
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
          }
        ]
      }
    ]
  }

  const data = await sequelize.transaction(async transaction => {
    queryOptions.transaction = transaction

    const student = await Student.create(queryData, queryOptions)

    await student.User.setRoles(Roles, { transaction })

    const data = formatModelData(student)

    data.User.Roles = Roles

    return data
  })

  delete data.User.password

  res.status(200).json({
    data
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
