const asyncHandler = require('express-async-handler')

const RegioError = require('../../libs/error/regio-error.js')

const authorize = require('../helpers/authorize.js')

const { body, param } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const formatModelData = require('../helpers/format-model-data.js')

const {
  sequelize,
  models: { Person, User, Student, ContactInfo }
} = require('../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  param('StudentId')
    .isInt()
    .toInt(),
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
  body('dob').isISO8601()
)

const handler = asyncHandler(async (req, res, next) => {
  const { StudentId, firstName, middleName, lastName, dob } = req.getData()

  if (!req.grants.includes('sysadmin')) {
    const { UserId } = req.session.user

    if (UserId !== `${StudentId}`) {
      throw new RegioError(403, 'not authorized')
    }
  }

  const student = await Student.findByPk(StudentId, {
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
  })

  if (!student) {
    throw new RegioError(400, 'invalid request')
  }

  await sequelize.transaction(async transaction => {
    await Promise.all([
      student.User.Person.update(
        { firstName, middleName, lastName, dob },
        { transaction }
      )
    ])

    return student.reload({ transaction })
  })

  const data = formatModelData(student)

  delete data.User.password

  res.status(200).json({
    data
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
