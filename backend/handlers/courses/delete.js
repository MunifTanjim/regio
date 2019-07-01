const asyncHandler = require('express-async-handler')

const RegioError = require('../../libs/error/regio-error.js')

const authorize = require('../helpers/authorize.js')

const { param } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const {
  Sequelize,
  models: { Course }
} = require('../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  param('CourseId')
    .isInt()
    .withMessage('must be an integer')
    .custom(id =>
      Course.findByPk(id, { attributes: ['CourseId'] }).then(course => {
        if (!course) throw new Error('does not exists')
      })
    )
)

const handler = asyncHandler(async (req, res, next) => {
  const { CourseId } = req.getData()

  const queryOptions = {
    attributes: {
      include: [
        [
          Sequelize.fn('COUNT', Sequelize.col('TermCourses.CourseId')),
          'totalTermCourses'
        ]
      ]
    },
    group: ['Course.CourseId'],
    include: [
      {
        association: Course.TermCourses,
        attributes: []
      }
    ]
  }

  const course = await Course.findByPk(CourseId, queryOptions)

  if (Number(course.get('totalTermCourses'))) {
    throw new RegioError(
      405,
      `Not allowed! What will happen to those ${course.get(
        'totalTermCourses'
      )} TermCourses?!`
    )
  }

  await course.destroy()

  res.status(204).json({
    data: null
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
