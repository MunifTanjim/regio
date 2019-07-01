const asyncHandler = require('express-async-handler')

const RegioError = require('../../../libs/error/regio-error.js')

const authorize = require('../../helpers/authorize.js')

const { param, query } = require('express-validator/check')
const validationMiddleware = require('../../helpers/validation-middleware.js')

const parseFieldsQuery = require('../../helpers/parse-fields-query.js')
const parseFilterQuery = require('../../helpers/parse-filter-query.js')
const formatModelData = require('../../helpers/format-model-data.js')
const getEntityIdFromUserId = require('../../helpers/get-entity-id-from-user-id.js')

const {
  models: { Enrollment, Student }
} = require('../../../database/index.js')

const PERMITS = ['sysadmin', 'head', 'teacher', 'student']

const validators = validationMiddleware(
  param('StudentId')
    .isInt()
    .custom(id =>
      Student.findByPk(id, { attributes: ['StudentId'] }).then(student => {
        if (!student) throw new Error('does not exist')
      })
    )
    .toInt(),
  query('fields')
    .optional()
    .isString()
    .withMessage('must be string'),
  query('filter')
    .optional()
    .isString()
    .withMessage('must be string')
)

const handler = asyncHandler(async (req, res, next) => {
  const { StudentId, fields, filter } = req.getData()

  if (!req.grants.includes('sysadmin')) {
    const { UserId } = req.session.user

    if (!req.grants.includes('head') && req.grants.includes('teacher')) {
      const adviserId = await Student.findByPk(StudentId, {
        attributes: ['adviserId']
      }).then(student => student.get('adviserId'))

      if (adviserId !== getEntityIdFromUserId(UserId)) {
        throw new RegioError(401, 'not authorized')
      }
    } else if (
      req.grants.includes('student') &&
      StudentId !== getEntityIdFromUserId(UserId)
    ) {
      throw new RegioError(401, 'not authorized')
    }
  }

  const queryOptions = {
    attributes: parseFieldsQuery(fields, ['TermId', 'CourseId', 'StudentId']),
    where: {
      ...parseFilterQuery(filter),
      StudentId
    }
  }

  const {
    count: totalItems,
    rows: enrollments
  } = await Enrollment.findAndCountAll(queryOptions)

  const items = enrollments.map(formatModelData)

  res.status(200).json({
    data: {
      kind: 'Enrollment',
      items,
      totalItems,
      params: {
        StudentId
      }
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
