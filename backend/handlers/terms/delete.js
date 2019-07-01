const asyncHandler = require('express-async-handler')

const RegioError = require('../../libs/error/regio-error.js')

const authorize = require('../helpers/authorize.js')

const { param } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const {
  Sequelize,
  models: { Term }
} = require('../../database/index.js')

const PERMITS = ['sysadmin']

const validators = validationMiddleware(
  param('TermId')
    .isInt()
    .withMessage('must be an integer')
    .custom(id =>
      Term.findByPk(id).then(term => {
        if (!term) throw new Error('does not exists')
      })
    )
)

const handler = asyncHandler(async (req, res, next) => {
  const { TermId } = req.getData()

  const queryOptions = {
    attributes: {
      include: [
        [
          Sequelize.fn('COUNT', Sequelize.col('TermCourses.TermId')),
          'totalTermCourses'
        ]
      ]
    },
    group: ['Term.TermId'],
    include: [
      {
        association: Term.TermCourses,
        attributes: []
      }
    ]
  }

  const term = await Term.findByPk(TermId, queryOptions)

  if (Number(term.get('totalTermCourses'))) {
    throw new RegioError(405, 'not allowed')
  }

  await term.destroy()

  res.status(200).json({
    data: {
      params: {
        TermId
      }
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
