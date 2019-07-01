const asyncHandler = require('express-async-handler')

const RegioError = require('../../libs/error/regio-error.js')

const authorize = require('../helpers/authorize.js')

const { param, query } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const parseFieldsQuery = require('../helpers/parse-fields-query.js')
const formatModelData = require('../helpers/format-model-data.js')

const {
  models: { ContactInfo, Person, Teacher, User }
} = require('../../database/index.js')

const PERMITS = ['sysadmin', 'head', 'student', 'teacher']

const validators = validationMiddleware(
  param('id')
    .isInt()
    .withMessage('must be an integer'),
  query('fields')
    .optional()
    .isString()
    .withMessage('must be string')
)

const handler = asyncHandler(async (req, res, next) => {
  const { id, fields } = req.getData()

  const queryOptions = {
    attributes: parseFieldsQuery(fields),
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

  const teacher = await Teacher.findByPk(id, queryOptions)

  if (!teacher) {
    throw new RegioError(404, 'not found')
  }

  const data = formatModelData(teacher)

  delete data.User.password

  res.status(200).json({
    data
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
