const asyncHandler = require('express-async-handler')

const map = require('lodash/map')

const RegioError = require('../../../../../../libs/error/regio-error.js')

const authorize = require('../../../../../helpers/authorize.js')

const { param } = require('express-validator/check')
const validationMiddleware = require('../../../../../helpers/validation-middleware.js')

const formatModelData = require('../../../../../helpers/format-model-data.js')
const getEntityIdFromUserId = require('../../../../../helpers/get-entity-id-from-user-id.js')

const {
  Sequelize: { Op },
  models: { Course, Teacher, Research, ResearchMark }
} = require('../../../../../../database/index.js')

const PERMITS = ['sysadmin', 'head', 'teacher']

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
        if (!course || course.get('type') !== 'supervised') {
          throw new Error('does not exist')
        }
      })
    )
)

const handler = asyncHandler(async (req, res, next) => {
  const { TeacherId, TermId, CourseId } = req.getData()

  const queryOptions = {
    where: { TermId, CourseId }
  }

  if (!req.grants.includes('sysadmin') && !req.grants.includes('head')) {
    const { UserId } = req.session.user

    if (req.grants.includes('teacher')) {
      if (TeacherId !== getEntityIdFromUserId(UserId)) {
        throw new RegioError(401, 'not authorized')
      }

      const StudentIds = await Research.findAll({
        attributes: ['StudentId'],
        where: {
          TermId,
          CourseId,
          TeacherId
        }
      }).then(researches => map(researches, 'StudentId'))

      queryOptions.where.StudentId = {
        [Op.in]: StudentIds
      }
    }
  }

  const researchMarks = await ResearchMark.findAll(queryOptions)

  const items = researchMarks.map(formatModelData)

  res.status(200).json({
    data: {
      kind: 'ResearchMark',
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
