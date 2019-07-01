const asyncHandler = require('express-async-handler')

const authorize = require('../../../helpers/authorize.js')

const groupBy = require('lodash/groupBy')
const map = require('lodash/map')
const mapValues = require('lodash/mapValues')

const { param } = require('express-validator/check')
const validationMiddleware = require('../../../helpers/validation-middleware.js')

const formatModelData = require('../../../helpers/format-model-data.js')

const {
  sequelize,
  Sequelize: { Op },
  models: {
    Course,
    Enrollment,
    ClassTestMark,
    ResearchMark,
    SessionalMark,
    TheoryMark
  }
} = require('../../../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  param('StudentId')
    .isInt()
    .withMessage('must be an integer'),
  param('TermId')
    .isInt()
    .withMessage('must be an integer')
)

const handler = asyncHandler(async (req, res, next) => {
  const { StudentId, TermId } = req.getData()

  const [totalItems, enrollments] = await sequelize.transaction(
    async transaction => {
      const [totalItems, enrollments] = await Enrollment.update(
        { approved: true },
        {
          where: { TermId, StudentId },
          returning: true,
          transaction
        }
      )

      const enrolledCourseIds = map(enrollments, 'CourseId')

      const courseIdsByType = await Course.findAll({
        attributes: ['CourseId', 'type'],
        where: { CourseId: { [Op.in]: enrolledCourseIds } },
        transaction
      })
        .then(courses => groupBy(courses, 'type'))
        .then(coursesByType =>
          mapValues(coursesByType, courses => map(courses, 'CourseId'))
        )

      for (const [type, CourseIds] of Object.entries(courseIdsByType)) {
        if (type === 'theory') {
          await Promise.all([
            TheoryMark.destroy({
              where: { TermId, StudentId, CourseId: { [Op.notIn]: CourseIds } },
              transaction
            }),
            ClassTestMark.destroy({
              where: { TermId, StudentId, CourseId: { [Op.notIn]: CourseIds } },
              transaction
            })
          ])

          await Promise.all(
            CourseIds.map(CourseId =>
              TheoryMark.upsert(
                { TermId, CourseId, StudentId },
                { transaction }
              )
            )
          )
        } else if (type === 'sessional') {
          await SessionalMark.destroy({
            where: { TermId, StudentId, CourseId: { [Op.notIn]: CourseIds } },
            transaction
          })

          await Promise.all(
            CourseIds.map(CourseId =>
              SessionalMark.upsert(
                { TermId, CourseId, StudentId },
                { transaction }
              )
            )
          )
        } else if (type === 'supervised') {
          await ResearchMark.destroy({
            where: { TermId, StudentId, CourseId: { [Op.notIn]: CourseIds } },
            transaction
          })

          await Promise.all(
            CourseIds.map(CourseId =>
              ResearchMark.upsert(
                { TermId, CourseId, StudentId },
                { transaction }
              )
            )
          )
        }
      }

      return [totalItems, enrollments]
    }
  )

  const items = enrollments.map(formatModelData)

  res.status(200).json({
    data: {
      kind: 'Enrollment',
      items,
      totalItems,
      params: {
        StudentId,
        TermId
      }
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
