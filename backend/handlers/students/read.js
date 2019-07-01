const asyncHandler = require('express-async-handler')

const RegioError = require('../../libs/error/regio-error.js')

const authorize = require('../helpers/authorize.js')

const { param, query } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const parseFieldsQuery = require('../helpers/parse-fields-query.js')
const formatModelData = require('../helpers/format-model-data.js')
const getEntityIdFromUserId = require('../helpers/get-entity-id-from-user-id.js')

const {
  models: { ContactInfo, Person, Student, User }
} = require('../../database/index.js')

const PERMITS = ['sysadmin', 'head', 'teacher', 'student']

const validators = validationMiddleware(
  param('id')
    .isInt()
    .withMessage('must be an integer')
    .toInt(),
  query('fields')
    .optional()
    .isString()
    .withMessage('must be string')
)

const handler = asyncHandler(async (req, res, next) => {
  const { UserId } = req.session.user
  const { id, fields } = req.getData()

  if (!req.grants.includes('sysadmin') && !req.grants.includes('teacher')) {
    if (req.grants.includes('student')) {
      if (id !== getEntityIdFromUserId(UserId)) {
        throw new RegioError(401, 'not authorized')
      }
    }
  }

  const queryOptions = {
    attributes: parseFieldsQuery(fields),
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

  const data = formatModelData(student)

  delete data.User.password

  res.status(200).json({
    data
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
