const asyncHandler = require('express-async-handler')

const RegioError = require('../../libs/error/regio-error.js')

const authorize = require('../helpers/authorize.js')

const { param } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const {
  Sequelize,
  models: { Batch }
} = require('../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  param('BatchId')
    .isInt()
    .withMessage('must be an integer')
    .custom(id =>
      Batch.findByPk(id, { attributes: ['BatchId'] }).then(batch => {
        if (!batch) throw new Error('does not exists')
      })
    )
)

const handler = asyncHandler(async (req, res, next) => {
  const { BatchId } = req.getData()

  const queryOptions = {
    attributes: {
      include: [
        [
          Sequelize.fn('COUNT', Sequelize.col('Students.StudentId')),
          'totalStudents'
        ]
      ]
    },
    group: ['Batch.BatchId'],
    include: [
      {
        association: Batch.Students,
        attributes: []
      }
    ]
  }

  const batch = await Batch.findByPk(BatchId, queryOptions)

  if (Number(batch.get('totalStudents'))) {
    throw new RegioError(
      405,
      `Not allowed! What will happen to those ${batch.get(
        'totalStudents'
      )} students?!`
    )
  }

  await batch.destroy()

  res.status(204).json({
    data: null
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
