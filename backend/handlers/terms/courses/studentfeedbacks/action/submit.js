const asyncHandler = require('express-async-handler')

const get = require('lodash/get')

const RegioError = require('../../../../../libs/error/regio-error.js')

const authorize = require('../../../../helpers/authorize.js')

const { body, param } = require('express-validator/check')
const validationMiddleware = require('../../../../helpers/validation-middleware.js')

const getEntityIdFromUserId = require('../../../../helpers/get-entity-id-from-user-id.js')
const formatModelData = require('../../../../helpers/format-model-data.js')

const {
  sequelize,
  models: {
    Course,
    Enrollment,
    Term,
    Teacher,
    TermCourseTeacher,
    StudentFeedback,
    StudentFeedbackTracker
  }
} = require('../../../../../database/index.js')

const PERMITS = ['student']

const validators = validationMiddleware(
  param('TermId')
    .isInt()
    .toInt()
    .custom(id =>
      Term.findByPk(id, { attributes: ['TermId'] }).then(term => {
        if (!term) throw new Error('does not exist')
      })
    ),
  param('CourseId')
    .isInt()
    .toInt()
    .custom(id =>
      Course.findByPk(id, {
        attributes: ['CourseId']
      }).then(course => {
        if (!course) throw new Error('does not exist')
      })
    ),
  body('TeacherId')
    .isInt()
    .toInt()
    .custom(id =>
      Teacher.findByPk(id, {
        attributes: ['TeacherId']
      }).then(teacher => {
        if (!teacher) throw new Error('does not exist')
      })
    ),
  body('byId')
)

const handler = asyncHandler(async (req, res, next) => {
  const { TermId, CourseId, TeacherId, byId: byStatementId } = req.getData()

  const { UserId } = req.session.user

  const StudentId = getEntityIdFromUserId(UserId)

  const enrollment = await Enrollment.findOne({
    attributes: ['StudentId', 'section'],
    where: { TermId, CourseId, StudentId }
  })

  if (!enrollment) {
    throw new RegioError(403, 'not authorized')
  }

  const termcourseteacher = await TermCourseTeacher.findOne({
    attributes: ['TeacherId'],
    where: { TermId, CourseId, TeacherId, section: enrollment.section }
  })

  if (!termcourseteacher) {
    throw new RegioError(400, 'invalid teacher')
  }

  const tracker = await StudentFeedbackTracker.findOne({
    where: { TermId, CourseId, TeacherId, StudentId }
  })

  if (tracker) {
    throw new RegioError(400, 'already submitted')
  }

  const feedbackRows = Object.keys(byStatementId)
    .map(Number)
    .map(FeedbackStatementId => ({
      TermId,
      CourseId,
      TeacherId,
      FeedbackStatementId,
      comment: get(byStatementId, [FeedbackStatementId, 'comment']),
      rate: String(get(byStatementId, [FeedbackStatementId, 'rate']))
    }))

  const trackerRows = Object.keys(byStatementId)
    .map(Number)
    .map(FeedbackStatementId => ({
      TermId,
      CourseId,
      TeacherId,
      FeedbackStatementId,
      StudentId
    }))

  const {
    count: totalItems,
    rows: studentfeedbacks
  } = await sequelize.transaction(async transaction => {
    await Promise.all([
      StudentFeedback.bulkCreate(feedbackRows, { transaction }),
      StudentFeedbackTracker.bulkCreate(trackerRows, { transaction })
    ])

    return StudentFeedback.findAndCountAll({
      where: { TermId, CourseId, TeacherId },
      transaction
    })
  })

  const items = studentfeedbacks.map(formatModelData)

  res.status(200).json({
    data: {
      kind: 'StudentFeedback',
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
