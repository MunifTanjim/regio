const asyncHandler = require('express-async-handler')

const difference = require('lodash/difference')
const flatten = require('lodash/flatten')
const map = require('lodash/map')

const RegioError = require('../../../../../libs/error/regio-error.js')

const authorize = require('../../../../helpers/authorize.js')

const { body, param } = require('express-validator/check')
const validationMiddleware = require('../../../../helpers/validation-middleware.js')

const formatModelData = require('../../../../helpers/format-model-data.js')

const {
  sequelize,
  Sequelize: { Op },
  models: { Course, Enrollment, Term }
} = require('../../../../../database/index.js')

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
        where: { type: { [Op.ne]: 'supervised' } }
      }).then(course => {
        if (!course) throw new Error('does not exist')
      })
    ),
  body('A').isArray(),
  body('B')
    .optional({ checkFalsy: true })
    .isArray(),
  body('C')
    .optional({ checkFalsy: true })
    .isArray()
)

const handler = asyncHandler(async (req, res, next) => {
  const { TermId, CourseId, ...StudentIdsBySection } = req.getData()

  const enrolledStudentIds = await Enrollment.findAll({
    attributes: ['StudentId'],
    where: { TermId, CourseId }
  }).then(enrollments => map(enrollments, 'StudentId'))
  const invalidStudentIds = difference(
    enrolledStudentIds,
    flatten(Object.values(StudentIdsBySection)).map(Number)
  )
  if (invalidStudentIds.length) {
    throw new RegioError(
      400,
      `StudentIds not enrolled: ${invalidStudentIds.sort().join(', ')}`
    )
  }

  const { count: totalItems, rows: enrollments } = await sequelize.transaction(
    async transaction => {
      await Promise.all(
        Object.entries(StudentIdsBySection).map(([section, _StudentIds]) =>
          Enrollment.update(
            { section },
            {
              where: { TermId, CourseId, StudentId: { [Op.in]: _StudentIds } },
              transaction
            }
          )
        )
      )

      return Enrollment.findAndCountAll({
        where: { TermId, CourseId },
        transaction
      })
    }
  )

  const items = enrollments.map(formatModelData)

  res.status(200).json({
    data: {
      kind: 'Enrollment',
      items,
      totalItems
    },
    params: {
      TermId,
      CourseId
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
