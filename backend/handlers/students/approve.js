const asyncHandler = require('express-async-handler')

const RegioError = require('../../libs/error/regio-error.js')

const authorize = require('../helpers/authorize.js')

const { param } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const formatModelData = require('../helpers/format-model-data.js')

const {
  models: { ContactInfo, Person, Student, User }
} = require('../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  param('id')
    .isInt()
    .withMessage('must be an integer')
)

const handler = asyncHandler(async (req, res, next) => {
  const { id } = req.getData()

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

  const student = await Student.findByPk(id, queryOptions)

  if (!student) {
    throw new RegioError(404, 'not found')
  }

  await student.User.update({ approved: true })

  res.status(200).json({
    data: formatModelData(student)
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
