const asyncHandler = require('express-async-handler')

const RegioError = require('../../../libs/error/regio-error.js')

const authorize = require('../../helpers/authorize.js')

const { body } = require('express-validator/check')
const validationMiddleware = require('../../helpers/validation-middleware.js')

const formatModelData = require('../../helpers/format-model-data.js')

const {
  models: { ContactInfo, Person, Teacher, User, Role }
} = require('../../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  body('TeacherId')
    .isInt()
    .withMessage('must be an integer')
    .toInt()
)

const handler = asyncHandler(async (req, res, next) => {
  const { TeacherId } = req.getData()

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
          },
          {
            association: User.Roles
          }
        ]
      }
    ]
  }

  const headRole = await Role.findByPk('head')

  let teacher = await Teacher.findByPk(TeacherId, queryOptions)

  if (!teacher) {
    throw new RegioError(404, 'not found')
  }

  await headRole.setUsers([teacher.User])

  teacher = await Teacher.findByPk(TeacherId, queryOptions)

  res.status(200).json({
    data: formatModelData(teacher)
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
