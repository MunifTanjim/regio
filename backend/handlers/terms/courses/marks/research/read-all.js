const asyncHandler = require('express-async-handler')

const map = require('lodash/map')

const authorize = require('../../../../helpers/authorize.js')

const { param } = require('express-validator/check')
const validationMiddleware = require('../../../../helpers/validation-middleware.js')

const formatModelData = require('../../../../helpers/format-model-data.js')
const getEntityIdFromUserId = require('../../../../helpers/get-entity-id-from-user-id.js')

const {
  Sequelize: { Op },
  models: { Course, Research, ResearchMark }
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
        if (!course || course.get('type') !== 'supervised') {
          throw new Error('does not exist')
        }
      })
    )
)

const handler = asyncHandler(async (req, res, next) => {
  const { TermId, CourseId } = req.getData()

  const queryOptions = {
    where: { TermId, CourseId }
  }

  if (!req.grants.includes('sysadmin') && !req.grants.includes('head')) {
    const { UserId } = req.session.user

    if (req.grants.includes('teacher')) {
      const TeacherId = getEntityIdFromUserId(UserId)

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
        TermId,
        CourseId
      }
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
