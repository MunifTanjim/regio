const asyncHandler = require('express-async-handler')

const isNumber = require('lodash/isNumber')
const mapValues = require('lodash/mapValues')
const { isNumeric } = require('validator')

const RegioError = require('../../../../../../libs/error/regio-error.js')

const authorize = require('../../../../../helpers/authorize.js')
const { body, param } = require('express-validator/check')
const validationMiddleware = require('../../../../../helpers/validation-middleware.js')

const formatModelData = require('../../../../../helpers/format-model-data.js')
const getEntityIdFromUserId = require('../../../../../helpers/get-entity-id-from-user-id.js')

const {
  sequelize,
  models: { TheoryMark, Course, Teacher, TermCourseTeacher }
} = require('../../../../../../database/index.js')

const PERMITS = ['teacher']

const isValidMark = (_mark, maxMark) => {
  const mark = Number(_mark)

  const isValid = isNumber(mark) ? mark >= 0 && mark <= maxMark : !mark
  if (!isValid) {
    throw new Error(`contains mark ${mark} exceeding range [0,${maxMark}]`)
  }

  return isValid
}

const isValidMarkObject = (marks, maxMarks) => {
  return (
    isValidMark(marks.attendance, maxMarks.attendance) &&
    isValidMark(marks.classTests, maxMarks.classTests) &&
    isValidMark(marks.finalExamSectionA, maxMarks.finalExamSectionA) &&
    isValidMark(marks.finalExamSectionB, maxMarks.finalExamSectionB)
  )
}

const isValidMarksByStudentIdObject = async (o, { CourseId }) => {
  const course = await Course.findByPk(CourseId, {
    attributes: ['creditHr']
  })

  const creditHr = Number(course.get('creditHr'))

  const maxMarks = {
    attendance: creditHr * 10,
    classTests: creditHr * 20,
    finalExamSectionA: creditHr * 35,
    finalExamSectionB: creditHr * 35
  }

  const StudentIds = Object.keys(o).map(String)
  const isValidStudentIds = StudentIds.every(id => id.length === 7)
  if (!isValidStudentIds) throw new Error('contains invalid StudentId')

  const markObjects = Object.values(o)
  for (const markObject of markObjects) {
    isValidMarkObject(markObject, maxMarks)
  }

  return true
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
  body('marksByStudentId').custom((marksByStudentId, { req }) =>
    isValidMarksByStudentIdObject(marksByStudentId, {
      CourseId: req.params.CourseId
    })
  )
)

const handler = asyncHandler(async (req, res, next) => {
  const { TeacherId, TermId, CourseId, marksByStudentId } = req.getData()

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

  const rows = Object.keys(marksByStudentId)
    .map(Number)
    .map(StudentId => ({
      TermId,
      CourseId,
      StudentId,
      ...mapValues(marksByStudentId[StudentId], v =>
        isNumeric(String(v)) ? v : null
      )
    }))

  const { count: totalItems, rows: theoryMarks } = await sequelize.transaction(
    async transaction => {
      await Promise.all(
        rows.map(row => TheoryMark.upsert(row, { transaction }))
      )

      return TheoryMark.findAndCountAll({
        where: { TermId, CourseId },
        transaction
      })
    }
  )

  const items = theoryMarks.map(formatModelData)

  res.status(200).json({
    data: {
      kind: 'TheoryMark',
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
