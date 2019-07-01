const asyncHandler = require('express-async-handler')
const qs = require('qs')

const cloneDeep = require('lodash/cloneDeep')

const authorize = require('../helpers/authorize.js')

const { query } = require('express-validator/check')
const validationMiddleware = require('../helpers/validation-middleware.js')

const parseFieldsQuery = require('../helpers/parse-fields-query.js')
const parseFilterQuery = require('../helpers/parse-filter-query.js')
const parseSortQuery = require('../helpers/parse-sort-query.js')
const applyAssociationFilter = require('../helpers/apply-association-filter.js')
const formatModelData = require('../helpers/format-model-data.js')

const {
  models: { ContactInfo, Person, Teacher, User }
} = require('../../database/index.js')

const PERMITS = ['sysadmin', 'head', 'student', 'teacher']

const validators = validationMiddleware(
  query('length')
    .optional()
    .isInt({ min: 1 })
    .withMessage('must be an integer greater than 0')
    .toInt(),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('must be an integer greater than 0')
    .toInt(),
  query('fields')
    .optional()
    .isString()
    .withMessage('must be string'),
  query('filter')
    .optional()
    .isString()
    .withMessage('must be string'),
  query('sort')
    .optional()
    .isString()
    .withMessage('must be string')
)

const handler = asyncHandler(async (req, res, next) => {
  const { length = 15, page = 1, fields, filter, sort } = req.getData()

  const queryOptions = {
    attributes: parseFieldsQuery(fields),
    limit: length + 1,
    offset: (page - 1) * length,
    order: parseSortQuery(sort, '+TeacherId'),
    where: parseFilterQuery(filter),
    include: [
      {
        association: Teacher.User,
        include: [
          {
            association: User.Person,
            include: [
              {
                association: Person.ContactInfos,
                include: [
                  {
                    association: ContactInfo.Address
                  }
                ]
              }
            ]
          },
          {
            association: User.Roles
          }
        ]
      }
    ]
  }

  applyAssociationFilter('Teacher', queryOptions.where, queryOptions.include)

  const { count: totalItems, rows: teachers } = await Teacher.findAndCountAll(
    queryOptions
  )

  const items = teachers.map(formatModelData)

  let nextLink
  if (items.length > length) {
    items.pop()

    const query = cloneDeep(req.query)
    query.page = page + 1
    nextLink = `${req.baseUrl}?${qs.stringify(query, {
      arrayFormat: 'repeat'
    })}`
  }

  items.forEach(item => delete item.User.password)

  res.status(200).json({
    data: {
      kind: 'Teacher',
      items,
      itemsPerPage: length,
      nextLink,
      pageIndex: page,
      totalItems,
      totalPages: Math.ceil(totalItems / length)
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
