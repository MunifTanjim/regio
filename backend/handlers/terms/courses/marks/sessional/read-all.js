const asyncHandler = require('express-async-handler')

const RegioError = require('../../../../../libs/error/regio-error.js')

const authorize = require('../../../../helpers/authorize.js')

const { param } = require('express-validator/check')
const validationMiddleware = require('../../../../helpers/validation-middleware.js')

const formatModelData = require('../../../../helpers/format-model-data.js')
const getEntityIdFromUserId = require('../../../../helpers/get-entity-id-from-user-id.js')

const {
  models: { Course, TermCourseTeacher, SessionalMark }
} = require('../../../../../database/index.js')

const PERMITS = ['sysadmin', 'head', 'teacher']

const validators = validationMiddleware(
  param('TermId')
    .isInt()
    .withMessage('must be an integer'),
  param('CourseId')
    .isInt()
    .withMessage('must be an integer')
    .custom(id =>
      Course.findByPk(id, { attributes: ['type'] }).then(course => {
        if (!course || course.get('type') !== 'sessional') {
          throw new Error('does not exist')
        }
      })
    )
)

const handler = asyncHandler(async (req, res, next) => {
  const { TeacherId, TermId, CourseId } = req.getData()

  if (!req.grants.includes('sysadmin') && !req.grants.includes('head')) {
    const { UserId } = req.session.user

    if (req.grants.includes('teacher')) {
      const TeacherId = getEntityIdFromUserId(UserId)

      const termcourse = await TermCourseTeacher.findOne({
        attributes: ['TeacherId'],
        where: { TermId, CourseId, TeacherId }
      })

      if (!termcourse) {
        throw new RegioError(401, 'not authorized')
      }
    }
  }

  const sessionalMarks = await SessionalMark.findAll({
    where: { TermId, CourseId }
  })

  const items = sessionalMarks.map(formatModelData)

  res.status(200).json({
    data: {
      kind: 'SessionalMark',
      items,
      totalItems: items.length,
      params: {
        TeacherId,
        TermId,
        CourseId
      }
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
