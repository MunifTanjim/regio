const asyncHandler = require('express-async-handler')

const map = require('lodash/map')
const difference = require('lodash/difference')

const RegioError = require('../../../helpers/regio-error.js')

const authorize = require('../../../helpers/authorize.js')

const { isInt } = require('validator')
const { body, param } = require('express-validator/check')
const validationMiddleware = require('../../../helpers/validation-middleware.js')

const formatModelData = require('../../../helpers/format-model-data.js')
const getEntityIdFromUserId = require('../../../helpers/get-entity-id-from-user-id.js')

const {
  models: { Attendance, Course, Enrollment, Term, TermCourseTeacher }
} = require('../../../../database/index.js')

const PERMITS = ['teacher']

const validSections = ['A', 'B', 'C']

const isValidStudentIds = StudentIds => {
  if (!Array.isArray(StudentIds) || !StudentIds.map(String).every(isInt)) {
    throw new Error(`must be an array of integers`)
  }

  return true
}

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
  body('date').isISO8601(),
  body('section')
    .isString()
    .isIn(validSections),
  body('StudentIds').custom(isValidStudentIds)
)

const handler = asyncHandler(async (req, res, next) => {
  const { TermId, CourseId, date, section, StudentIds } = req.getData()

  if (!req.grants.includes('sysadmin')) {
    const { UserId } = req.session.user

    if (req.grants.includes('teacher')) {
      const termcourse = await TermCourseTeacher.findOne({
        attributes: ['TeacherId'],
        where: {
          TermId,
          CourseId,
          TeacherId: getEntityIdFromUserId(UserId),
          section
        }
      })

      if (!termcourse) {
        throw new RegioError(401, 'not authorized')
      }
    }
  }

  const enrollments = await Enrollment.findAll({
    where: {
      TermId,
      CourseId,
      section
    }
  })

  const enrolledStudentIds = map(enrollments, 'StudentId')

  const notEnrolledIds = difference(StudentIds, enrolledStudentIds)

  if (notEnrolledIds.length) {
    throw new RegioError(400, `IDs not enrolled: ${notEnrolledIds.join(', ')}`)
  }

  const takenAttendance = await Attendance.findOne({
    where: {
      TermId,
      CourseId,
      date,
      section
    }
  })

  if (takenAttendance) {
    throw new RegioError(400, 'attendance already taken')
  }

  const attendance = await Attendance.create({
    TermId,
    CourseId,
    date,
    section,
    StudentIds
  })

  const data = formatModelData(attendance)

  res.status(200).json({
    data,
    params: {
      TermId,
      CourseId
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
