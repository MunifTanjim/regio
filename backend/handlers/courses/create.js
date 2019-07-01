const asyncHandler = require('express-async-handler')

const authorize = require('../helpers/authorize.js')

const { body } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const formatModelData = require('../helpers/format-model-data.js')

const {
  models: { Course }
} = require('../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  body('code')
    .isString()
    .matches(/^\w+ \d+$/)
    .custom(code =>
      Course.findOne({ where: { code } }).then(course => {
        if (course) throw new Error('already exists')
      })
    ),
  body('title')
    .isString()
    .not()
    .isEmpty(),
  body('creditHr').isDecimal(),
  body('type').isIn(Course.validTypes)
)

const handler = asyncHandler(async (req, res, next) => {
  const courseData = req.getData()

  const course = await Course.create(courseData)

  const data = formatModelData(course)

  res.status(200).json({
    data
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
