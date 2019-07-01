const asyncHandler = require('express-async-handler')

const RegioError = require('../../libs/error/regio-error.js')

const authorize = require('../helpers/authorize.js')

const { body, param } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const {
  ranks: teacherRanks
} = require('../../database/helpers/models/teacher.js')

const formatModelData = require('../helpers/format-model-data.js')

const {
  sequelize,
  models: { Person, User, Teacher, ContactInfo }
} = require('../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  param('TeacherId')
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
  body('dob').isISO8601(),
  body('rank').isIn(teacherRanks)
)

const handler = asyncHandler(async (req, res, next) => {
  const {
    TeacherId,
    firstName,
    middleName,
    lastName,
    dob,
    rank
  } = req.getData()

  if (!req.grants.includes('sysadmin')) {
    const { UserId } = req.session.user

    if (UserId !== `T${TeacherId}`) {
      throw new RegioError(403, 'not authorized')
    }
  }

  const teacher = await Teacher.findByPk(TeacherId, {
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
          },
          {
            association: User.Roles
          }
        ]
      }
    ]
  })

  if (!teacher) {
    throw new RegioError(400, 'invalid request')
  }

  await sequelize.transaction(async transaction => {
    await Promise.all([
      teacher.User.Person.update(
        { firstName, middleName, lastName, dob },
        { transaction }
      ),
      teacher.update({ rank }, { transaction })
    ])

    return teacher.reload({ transaction })
  })

  const data = formatModelData(teacher)

  delete data.User.password

  res.status(200).json({
    data
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
