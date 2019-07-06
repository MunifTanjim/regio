const asyncHandler = require('express-async-handler')

const authorize = require('../helpers/authorize.js')

const RegioError = require('../helpers/regio-error.js')

const { body, param } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const formatModelData = require('../helpers/format-model-data.js')

const {
  models: { Course }
} = require('../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  param('CourseId')
    .isInt()
    .withMessage('must be an integer')
    .toInt(),
  body('title')
    .isString()
    .not()
    .isEmpty(),
  body('type').isIn(Course.validTypes)
)

const handler = asyncHandler(async (req, res, next) => {
  const { CourseId, title, type } = req.getData()

  const course = await Course.findByPk(CourseId)

  if (!course) {
    throw new RegioError(404, 'not found')
  }

  await course.update({ title, type })

  const data = formatModelData(course)

  res.status(200).json({
    data
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
