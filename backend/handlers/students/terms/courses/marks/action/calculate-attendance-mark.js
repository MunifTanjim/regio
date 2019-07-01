const asyncHandler = require('express-async-handler')

const RegioError = require('../../../../../../libs/error/regio-error.js')

const authorize = require('../../../../../helpers/authorize.js')

const { param } = require('express-validator/check')
const validationMiddleware = require('../../../../../helpers/validation-middleware.js')

const getEntityIdFromUserId = require('../../../../../helpers/get-entity-id-from-user-id.js')

const calculateAttendanceMark = require('../../../../../helpers/marks/calculate-attendance-mark.js')

const {
  Sequelize: { Op },
  models: { Attendance, Course, Enrollment, Student, TermCourseTeacher }
} = require('../../../../../../database/index.js')

const PERMITS = ['sysadmin', 'head', 'teacher', 'student']

const validators = validationMiddleware(
  param('StudentId')
    .isInt()
    .withMessage('must be an integer')
    .toInt()
    .custom(id =>
      Student.findByPk(id, { attributes: ['StudentId'] }).then(student => {
        if (!student) throw new Error('does not exist')
      })
    ),
  param('TermId')
    .isInt()
    .withMessage('must be an integer'),
  param('CourseId')
    .isInt()
    .withMessage('must be an integer')
    .custom(id =>
      Course.findByPk(id, { attributes: ['type'] }).then(course => {
        if (!course || course.get('type') === 'supervised') {
          throw new Error('does not exist')
        }
      })
    )
)

const handler = asyncHandler(async (req, res, next) => {
  const { StudentId, TermId, CourseId } = req.getData()

  if (!req.grants.includes('sysadmin') && !req.grants.includes('head')) {
    const { UserId } = req.session.user

    if (req.grants.includes('teacher')) {
      const [adviserId, termcourse] = await Promise.all([
        Student.findByPk(StudentId, {
          attributes: ['adviserId']
        }).then(student => student.get('adviserId')),
        TermCourseTeacher.findOne({
          attributes: ['TeacherId'],
          where: {
            TermId,
            CourseId,
            TeacherId: getEntityIdFromUserId(UserId)
          }
        })
      ])

      if (!termcourse && adviserId !== getEntityIdFromUserId(UserId)) {
        throw new RegioError(401, 'not authorized')
      }
    } else if (
      req.grants.includes('student') &&
      StudentId !== getEntityIdFromUserId(UserId)
    ) {
      throw new RegioError(401, 'not authorized')
    }
  }

  let enrollment = await Enrollment.findOne({
    where: { TermId, CourseId, StudentId }
  })

  if (enrollment.get('type') === 'short') {
    enrollment = await Enrollment.findOne({
      order: [['TermId', 'DESC']],
      where: {
        CourseId,
        StudentId,
        TermId: { [Op.lt]: TermId },
        type: { [Op.ne]: 'short' }
      }
    })
  }

  const [attendances, course] = await Promise.all([
    Attendance.findAll({
      attributes: ['date', 'StudentIds'],
      where: {
        TermId: enrollment ? enrollment.get('TermId') : TermId,
        CourseId
      }
    }),
    Course.findByPk(CourseId, {
      attributes: ['creditHr']
    })
  ])

  const allDates = attendances.map(({ date }) => date)
  const attendedDates = attendances
    .map(({ date, StudentIds }) =>
      StudentIds.includes(StudentId) ? date : null
    )
    .filter(Boolean)

  const mark = calculateAttendanceMark(
    allDates.length,
    attendedDates.length,
    course.get('creditHr')
  )

  res.status(200).json({
    data: {
      mark,
      params: {
        StudentId,
        TermId,
        CourseId
      }
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
