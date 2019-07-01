const asyncHandler = require('express-async-handler')

const pick = require('lodash/pick')

const authorize = require('../../helpers/authorize.js')

const { param, query } = require('express-validator/check')
const validationMiddleware = require('../../helpers/validation-middleware.js')

const parseFieldsQuery = require('../../helpers/parse-fields-query.js')
const parseFilterQuery = require('../../helpers/parse-filter-query.js')
const formatModelData = require('../../helpers/format-model-data.js')

const {
  Sequelize: { Op },
  models: { Teacher, TermCourse, TermCourseTeacher }
} = require('../../../database/index.js')

const PERMITS = ['sysadmin', 'head', 'teacher']

const validators = validationMiddleware(
  param('TeacherId')
    .isInt()
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
  const { TeacherId, fields, filter } = req.getData()

  const TermIdCourseIdGroups = await TermCourseTeacher.findAll({
    attributes: ['TermId', 'CourseId'],
    where: { TeacherId }
  }).then(objs => objs.map(obj => pick(obj, ['TermId', 'CourseId'])))

  const termcourses = await TermCourse.findAll({
    attributes: parseFieldsQuery(fields, ['TermId', 'CourseId']),
    where: {
      ...parseFilterQuery(filter),
      [Op.or]: TermIdCourseIdGroups
    }
  })

  const items = formatModelData(termcourses)

  res.status(200).json({
    data: {
      kind: 'TermCourse',
      items,
      totalItems: items.length
    },
    params: {
      TeacherId
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
