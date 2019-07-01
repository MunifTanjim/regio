const asyncHandler = require('express-async-handler')

const authorize = require('../../../helpers/authorize.js')

const RegioError = require('../../../helpers/regio-error.js')

const { param } = require('express-validator/check')
const validationMiddleware = require('../../../helpers/validation-middleware.js')

const formatModelData = require('../../../helpers/format-model-data.js')
const getEntityIdFromUserId = require('../../../helpers/get-entity-id-from-user-id.js')

const {
  models: { Batch, Course, Term, TermCourse }
} = require('../../../../database/index.js')

const PERMITS = ['teacher']

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
    )
)

const handler = asyncHandler(async (req, res, next) => {
  const { TermId, CourseId } = req.getData()

  if (!req.grants.includes('sysadmin')) {
    const { UserId } = req.session.user

    if (req.grants.includes('teacher')) {
      const term = await Term.findByPk(TermId, { attributes: ['BatchId'] })
      if (!term) throw new RegioError(400, 'invalid term')

      const batch = await Batch.findByPk(term.BatchId, {
        attributes: ['coordinatorId']
      })

      if (batch.coordinatorId !== getEntityIdFromUserId(UserId)) {
        throw new RegioError(403, 'not authorized')
      }
    }
  }

  const termcourse = await TermCourse.findOne({
    where: { TermId, CourseId }
  })

  await termcourse.update({ feedbackOpen: !termcourse.feedbackOpen })

  const data = formatModelData(termcourse)

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
