const asyncHandler = require('express-async-handler')

const isNumber = require('lodash/isNumber')

const RegioError = require('../../../../../../../libs/error/regio-error.js')

const authorize = require('../../../../../../helpers/authorize.js')
const { body, param } = require('express-validator/check')
const validationMiddleware = require('../../../../../../helpers/validation-middleware.js')

const formatModelData = require('../../../../../../helpers/format-model-data.js')
const getEntityIdFromUserId = require('../../../../../../helpers/get-entity-id-from-user-id.js')

const {
  sequelize,
  models: { ClassTestMark, Course, Teacher, TermCourseTeacher }
} = require('../../../../../../../database/index.js')

const PERMITS = ['teacher']

const isValidMarksByStudentIdObject = o => {
  const StudentIds = Object.keys(o).map(String)
  const Marks = Object.values(o)
  return (
    StudentIds.every(id => id.length === 7) &&
    Marks.every(mark => (isNumber(mark) ? mark >= 0 && mark <= 20 : !mark))
  )
}

const validators = validationMiddleware(
  param('TeacherId')
    .isInt()
    .withMessage('must be an integer')
    .toInt()
    .custom(id =>
      Teacher.findByPk(id, { attributes: ['TeacherId'] }).then(teacher => {
        if (!teacher) throw new Error('does not exist')
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
        if (!course || course.get('type') !== 'theory') {
          throw new Error('does not exist')
        }
      })
    ),
  body('number')
    .isInt()
    .withMessage('must be an integer')
    .custom((number, { req }) =>
      Course.findByPk(req.params.CourseId, {
        attributes: ['creditHr']
      }).then(course => {
        if (Number(number) > Number(course.get('creditHr')) + 1) {
          throw new Error('not allowed')
        }
      })
    ),
  body('marksByStudentId').custom(isValidMarksByStudentIdObject)
)

const handler = asyncHandler(async (req, res, next) => {
  const {
    TeacherId,
    TermId,
    CourseId,
    number,
    marksByStudentId
  } = req.getData()

  if (!req.grants.includes('sysadmin')) {
    const { UserId } = req.session.user

    if (req.grants.includes('teacher')) {
      if (TeacherId !== getEntityIdFromUserId(UserId)) {
        throw new RegioError(401, 'not authorized')
      }

      const termcourse = await TermCourseTeacher.findOne({
        attributes: ['TeacherId'],
        where: { TermId, CourseId, TeacherId }
      })

      if (!termcourse) {
        throw new RegioError(401, 'not authorized')
      }
    }
  }

  const rows = Object.keys(marksByStudentId)
    .map(Number)
    .map(StudentId => ({
      TermId,
      CourseId,
      StudentId,
      number,
      mark: isNumber(marksByStudentId[StudentId])
        ? marksByStudentId[StudentId]
        : null
    }))

  const {
    count: totalItems,
    rows: classTestMarks
  } = await sequelize.transaction(async transaction => {
    await Promise.all(
      rows.map(row => ClassTestMark.upsert(row, { transaction }))
    )

    return ClassTestMark.findAndCountAll({
      where: { TermId, CourseId },
      transaction
    })
  })

  const items = classTestMarks.map(formatModelData)

  res.status(200).json({
    data: {
      kind: 'ClassTestMark',
      items,
      totalItems,
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
