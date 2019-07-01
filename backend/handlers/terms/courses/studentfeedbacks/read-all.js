const asyncHandler = require('express-async-handler')
const { map, uniq } = require('lodash')

const authorize = require('../../../helpers/authorize.js')

const { param, query } = require('express-validator/check')
const validationMiddleware = require('../../../helpers/validation-middleware.js')

const parseFieldsQuery = require('../../../helpers/parse-fields-query.js')
const parseFilterQuery = require('../../../helpers/parse-filter-query.js')
const formatModelData = require('../../../helpers/format-model-data.js')
const getEntityIdFromUserId = require('../../../helpers/get-entity-id-from-user-id.js')

const {
  models: { Course, Term, StudentFeedback, StudentFeedbackTracker },
  Sequelize: { Op }
} = require('../../../../database/index.js')

const PERMITS = ['sysadmin', 'head', 'teacher', 'student']

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
  query('fields')
    .optional()
    .isString()
    .withMessage('must be string'),
  query('filter')
    .optional()
    .isString()
    .withMessage('must be string')
)

const handler = asyncHandler(async (req, res, next) => {
  const { TermId, CourseId, fields, filter } = req.getData()

  const queryOptions = {
    attributes: parseFieldsQuery(fields, [
      'StudentFeedbackId',
      'TermId',
      'CourseId',
      'TeacherId',
      'FeedbackStatementId'
    ]),
    where: {
      ...parseFilterQuery(filter),
      TermId,
      CourseId
    }
  }

  if (!req.grants.includes('sysadmin')) {
    const { UserId } = req.session.user

    if (req.grants.includes('student')) {
      const trackers = await StudentFeedbackTracker.findAll({
        where: { StudentId: getEntityIdFromUserId(UserId) }
      })

      queryOptions.where = {
        ...queryOptions.where,
        [Op.and]: {
          TermId: { [Op.in]: uniq(map(trackers, 'TermId')) },
          CourseId: { [Op.in]: uniq(map(trackers, 'CourseId')) },
          TeacherId: { [Op.in]: uniq(map(trackers, 'TeacherId')) }
        }
      }
    }
  }

  const {
    count: totalItems,
    rows: studentfeedbacks
  } = await StudentFeedback.findAndCountAll(queryOptions)

  const items = studentfeedbacks.map(formatModelData)

  res.status(200).json({
    data: {
      kind: 'StudentFeedback',
      items,
      totalItems,
      params: {
        TermId,
        CourseId
      }
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
