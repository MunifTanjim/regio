const asyncHandler = require('express-async-handler')

const RegioError = require('../../../libs/error/regio-error.js')

const authorize = require('../../helpers/authorize.js')

const { param, query } = require('express-validator/check')
const validationMiddleware = require('../../helpers/validation-middleware.js')

const parseFieldsQuery = require('../../helpers/parse-fields-query.js')
const formatModelData = require('../../helpers/format-model-data.js')
const getEntityIdFromUserId = require('../../helpers/get-entity-id-from-user-id.js')

const {
  models: { ContactInfo, Person, User, Student, Teacher }
} = require('../../../database/index.js')

const PERMITS = ['sysadmin', 'head', 'teacher', 'student']

const validators = validationMiddleware(
  param('StudentId')
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
  const { StudentId, fields } = req.getData()

  if (!req.grants.includes('sysadmin')) {
    if (req.grants.includes('student')) {
      if (StudentId !== getEntityIdFromUserId(UserId)) {
        throw new RegioError(401, 'not authorized')
      }
    }
  }

  const TeacherId = await Student.findByPk(StudentId, {
    attributes: ['adviserId']
  }).then(student => student.get('TeacherId'))

  if (!TeacherId) {
    throw new RegioError(404, 'not found')
  }

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

  const teacher = await Teacher.findByPk(TeacherId, queryOptions)

  const data = formatModelData(teacher)

  delete data.User.password

  res.status(200).json({
    data
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
