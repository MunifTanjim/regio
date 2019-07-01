const asyncHandler = require('express-async-handler')

const differenceBy = require('lodash/differenceBy')
const isPlainObject = require('lodash/isPlainObject')
const map = require('lodash/map')
const pick = require('lodash/pick')
const some = require('lodash/some')

const RegioError = require('../../../libs/error/regio-error.js')

const authorize = require('../../helpers/authorize.js')

const { isInt } = require('validator')
const { body, param } = require('express-validator/check')
const validationMiddleware = require('../../helpers/validation-middleware.js')

const formatModelData = require('../../helpers/format-model-data.js')
const getEntityIdFromUserId = require('../../helpers/get-entity-id-from-user-id.js')

const {
  sequelize,
  Sequelize: { Op },
  models: { Enrollment, Term, Student }
} = require('../../../database/index.js')

const isValidSessionYearId = SessionYearId => {
  if (!/^\d{4}-\d{4}$/.test(SessionYearId)) return false
  const [start, end] = SessionYearId.split('-').map(Number)
  return end === start + 1
}

const isValidTermObject = (o, i) => {
  if (!isPlainObject(o)) throw new Error(`must be an object`)

  const { SessionYearId, level, term } = o

  if (!isValidSessionYearId(SessionYearId)) {
    throw new Error(`invalid Term.SessionYearId format`)
  }

  if (!['1', '2', '3', '4'].includes(String(level))) {
    throw new Error(`invalid Term.level`)
  }

  if (!['1', '2'].includes(String(term))) {
    throw new Error(`invalid Term.term`)
  }

  return true
}

const isValidCoursesArray = arr => {
  if (!Array.isArray(arr)) throw new Error(`invalid format`)

  arr.forEach((o, i) => {
    if (!isPlainObject(o)) throw new Error(`courses[${i}] must be an object`)

    const { CourseId, type } = o

    if (!isInt(String(CourseId))) {
      throw new Error(`courses[${i}].CourseId must be an integer`)
    }

    if (!Enrollment.validTypes.includes(type)) {
      throw new Error(`invalid courses[${i}].type`)
    }
  })

  return true
}

const PERMITS = ['sysadmin', 'student']

const validators = validationMiddleware(
  param('StudentId')
    .isInt()
    .custom(id =>
      Student.findByPk(id).then(student => {
        if (!student) throw new Error('does not exist')
      })
    )
    .toInt(),
  body('Term').custom(isValidTermObject),
  body('courses').custom(courses => isValidCoursesArray(courses))
)

const handler = asyncHandler(async (req, res, next) => {
  const { UserId } = req.session.user
  const { StudentId, Term: termObject, courses } = req.getData()

  if (!req.grants.includes('sysadmin')) {
    if (
      req.grants.includes('student') &&
      StudentId !== getEntityIdFromUserId(UserId)
    ) {
      throw new RegioError(401, 'not authorized')
    }
  }

  const term = await Term.findOne({
    attributes: ['TermId'],
    where: termObject,
    include: [
      {
        association: Term.Courses,
        attributes: ['CourseId'],
        through: { attributes: [] }
      }
    ]
  })

  const termCourseIds = map(term.Courses, 'CourseId')

  if (
    map(courses, 'CourseId').some(id => !termCourseIds.includes(Number(id)))
  ) {
    throw new RegioError(400, 'some courses are not available for this term')
  }

  const TermId = term.get('TermId')

  const oldTermEnrollments = await Enrollment.findAll({
    where: { TermId, StudentId }
  })

  if (
    !req.grants.includes('sysadmin') &&
    some(oldTermEnrollments, 'approved')
  ) {
    throw new RegioError(400, 'already approved')
  }

  const newTermEnrollments = courses.map(({ CourseId, type }) => ({
    TermId: Number(TermId),
    CourseId: Number(CourseId),
    StudentId,
    type
  }))

  const toDelete = differenceBy(
    oldTermEnrollments,
    newTermEnrollments,
    'CourseId'
  )

  const toInsert = differenceBy(
    newTermEnrollments,
    oldTermEnrollments,
    'CourseId'
  )

  const enrollments = await sequelize.transaction(async transaction => {
    await Enrollment.destroy({
      where: {
        [Op.or]: toDelete.map(o => pick(o, ['TermId', 'CourseId', 'StudentId']))
      },
      transaction
    })

    if (toInsert.length) {
      await Enrollment.bulkCreate(toInsert, { transaction })
    }

    return Enrollment.findAll({ where: { TermId, StudentId }, transaction })
  })

  const items = formatModelData(enrollments)

  res.status(200).json({
    data: {
      kind: 'Enrollment',
      items,
      totalItems: items.length,
      params: {
        StudentId
      }
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
