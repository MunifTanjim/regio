const asyncHandler = require('express-async-handler')

const RegioError = require('../../../helpers/regio-error.js')

const authorize = require('../../../helpers/authorize.js')

const { param, query } = require('express-validator/check')
const validationMiddleware = require('../../../helpers/validation-middleware.js')

const parseFieldsQuery = require('../../../helpers/parse-fields-query.js')
const parseFilterQuery = require('../../../helpers/parse-filter-query.js')
const formatModelData = require('../../../helpers/format-model-data.js')
const getEntityIdFromUserId = require('../../../helpers/get-entity-id-from-user-id.js')

const {
  models: { Attendance, Course, Term, TermCourseTeacher }
} = require('../../../../database/index.js')

const PERMITS = ['sysadmin', 'head', 'teacher']

const validators = validationMiddleware(
  param('TermId')
    .isInt()
    .custom(id =>
      Term.findByPk(id, { attributes: ['TermId'] }).then(term => {
        if (!term) throw new Error('does not exist')
      })
    ),
  param('CourseId')
    .isInt()
    .custom(id =>
      Course.findByPk(id, { attributes: ['CourseId'] }).then(course => {
        if (!course) throw new Error('does not exist')
      })
    ),
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
  const { UserId } = req.session.user
  const { TermId, CourseId, fields, filter } = req.getData()

  if (!req.grants.includes('sysadmin')) {
    if (req.grants.includes('teacher')) {
      const termcourse = await TermCourseTeacher.findOne({
        attributes: ['TeacherId'],
        where: {
          TermId,
          CourseId,
          TeacherId: getEntityIdFromUserId(UserId)
        }
      })

      if (!termcourse) {
        throw new RegioError(401, 'not authorized')
      }
    }
  }

  const queryOptions = {
    attributes: parseFieldsQuery(fields, [
      'TermId',
      'CourseId',
      'date',
      'section'
    ]),
    where: {
      ...parseFilterQuery(filter),
      TermId,
      CourseId
    }
  }

  const {
    count: totalItems,
    rows: attendances
  } = await Attendance.findAndCountAll(queryOptions)

  const items = attendances.map(formatModelData)

  res.status(200).json({
    data: {
      kind: 'Attendance',
      items,
      totalItems,
      params: {
        TermId,
        CourseId
      }
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
