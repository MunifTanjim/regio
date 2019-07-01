const asyncHandler = require('express-async-handler')

const unionBy = require('lodash/unionBy')

const RegioError = require('../../../libs/error/regio-error.js')

const authorize = require('../../helpers/authorize.js')

const { param, query } = require('express-validator/check')
const validationMiddleware = require('../../helpers/validation-middleware.js')

const parseFieldsQuery = require('../../helpers/parse-fields-query.js')
const parseFilterQuery = require('../../helpers/parse-filter-query.js')
const formatModelData = require('../../helpers/format-model-data.js')
const getEntityIdFromUserId = require('../../helpers/get-entity-id-from-user-id.js')

const {
  models: { Teacher, Term }
} = require('../../../database/index.js')

const PERMITS = ['sysadmin', 'head', 'teacher']

const validators = validationMiddleware(
  param('TeacherId')
    .isInt()
    .toInt()
    .custom(id =>
      Teacher.findByPk(id, { attributes: ['TeacherId'] }).then(teacher => {
        if (!teacher) throw new Error('does not exist')
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
  const { UserId } = req.session.user
  const { TeacherId, fields, filter } = req.getData()

  if (!req.grants.includes('sysadmin')) {
    if (
      req.grants.includes('teacher') &&
      TeacherId !== getEntityIdFromUserId(UserId)
    ) {
      throw new RegioError(401, 'not authorized')
    }
  }

  const terms = await Term.findAll({
    attributes: parseFieldsQuery(fields, ['TermId']),
    where: parseFilterQuery(filter),
    include: [
      {
        association: Term.TermCourseTeachers,
        attributes: [],
        where: { TeacherId }
      }
    ]
  })

  const moreTerms = await Term.findAll({
    attributes: parseFieldsQuery(fields, ['TermId']),
    where: parseFilterQuery(filter),
    include: [
      {
        association: Term.Researches,
        attributes: [],
        where: { TeacherId }
      }
    ]
  })

  const _items = formatModelData(terms)
  const _moreItems = formatModelData(moreTerms)

  const items = unionBy(_items, _moreItems, 'id')

  res.status(200).json({
    data: {
      kind: 'Term',
      items,
      totalItems: items.length,
      params: {
        TeacherId
      }
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
