const asyncHandler = require('express-async-handler')

const authorize = require('../../helpers/authorize.js')

const { body, param } = require('express-validator/check')
const validationMiddleware = require('../../helpers/validation-middleware.js')

const {
  models: { Student }
} = require('../../../database/index.js')

const PERMITS = ['sysadmin', 'head']

const validators = validationMiddleware(
  param('StudentId')
    .isInt()
    .withMessage('must be an integer')
    .toInt()
    .custom(StudentId =>
      Student.findByPk(StudentId, { attributes: ['StudentId'] }).then(
        student => {
          if (!student) throw new Error('does not exist')
        }
      )
    ),
  body('TeacherId')
    .isInt()
    .withMessage('must be an integer')
    .toInt()
)

const handler = asyncHandler(async (req, res, next) => {
  const { StudentId, TeacherId } = req.getData()

  const student = await Student.findByPk(StudentId)

  await student.update({ adviserId: TeacherId })

  res.status(200).json({
    data: {
      StudentId,
      TeacherId,
      adviserId: TeacherId
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
