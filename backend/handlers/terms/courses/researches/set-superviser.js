const asyncHandler = require('express-async-handler')

const RegioError = require('../../../../libs/error/regio-error.js')

const authorize = require('../../../helpers/authorize.js')

const { body, param } = require('express-validator/check')
const validationMiddleware = require('../../../helpers/validation-middleware.js')

const formatModelData = require('../../../helpers/format-model-data.js')

const {
  sequelize,
  models: { Course, Enrollment, Student, Teacher, Term, Research }
} = require('../../../../database/index.js')

const PERMITS = ['sysadmin']

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
      Course.findByPk(id, {
        attributes: ['CourseId'],
        where: { type: 'supervised' }
      }).then(course => {
        if (!course) throw new Error('does not exist')
      })
    ),
  body('StudentId')
    .isInt()
    .custom(id =>
      Student.findByPk(id, { attributes: ['StudentId'] }).then(student => {
        if (!student) throw new Error('does not exist')
      })
    ),
  body('TeacherId')
    .isInt()
    .custom(id =>
      Teacher.findByPk(id, { attributes: ['TeacherId'] }).then(teacher => {
        if (!teacher) throw new Error('does not exist')
      })
    )
)

const handler = asyncHandler(async (req, res, next) => {
  const { TermId, CourseId, StudentId, TeacherId } = req.getData()

  const enrollment = await Enrollment.findOne({
    where: {
      TermId,
      CourseId,
      StudentId
    }
  })

  if (!enrollment) {
    throw new RegioError(404, 'enrollment does not exist')
  }

  if (!enrollment.get('approved')) {
    throw new RegioError(400, 'enrollment is not approved')
  }

  const researches = await sequelize.transaction(async transaction => {
    await Research.upsert(
      {
        TermId,
        CourseId,
        StudentId,
        TeacherId
      },
      { transaction }
    )

    return Research.findOne({
      where: {
        TermId,
        CourseId,
        StudentId
      },
      transaction
    })
  })

  const data = formatModelData(researches)

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
