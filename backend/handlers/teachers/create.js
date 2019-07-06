const asyncHandler = require('express-async-handler')

const authorize = require('../helpers/authorize.js')

const { body } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const { hashPassword } = require('../../libs/securepassword.js')

const getEntityIdFromUserId = require('../helpers/get-entity-id-from-user-id.js')
const formatModelData = require('../helpers/format-model-data.js')

const {
  ranks: teacherRanks
} = require('../../database/helpers/models/teacher.js')

const {
  models: { Person, User, Teacher, ContactInfo },
  sequelize
} = require('../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  body('UserId')
    .isString()
    .matches(/^T\d+$/)
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
  body('rank').isIn(teacherRanks),
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
    rank,
    email,
    mobile,
    phone
  } = req.getData()

  const RoleId = 'teacher'
  const Roles = [RoleId]

  const queryData = {
    TeacherId: getEntityIdFromUserId(UserId),
    rank,
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
        association: Teacher.User,
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

    const teacher = await Teacher.create(queryData, queryOptions)

    await teacher.User.setRoles(Roles, { transaction })

    const data = formatModelData(teacher)

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
