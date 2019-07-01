const asyncHandler = require('express-async-handler')

const isPlainObject = require('lodash/isPlainObject')
const differenceBy = require('lodash/differenceBy')
const intersectionBy = require('lodash/intersectionBy')

const authorize = require('../../../helpers/authorize.js')

const { isInt } = require('validator')
const { body, param } = require('express-validator/check')
const validationMiddleware = require('../../../helpers/validation-middleware.js')

const formatModelData = require('../../../helpers/format-model-data.js')

const {
  sequelize,
  models: { Course, Term, TermCourseTeacher }
} = require('../../../../database/index.js')

const PERMITS = ['sysadmin']

const validSections = ['A', 'B', 'C']

const isValidTeacherIdsBySectionObject = o => {
  if (!isPlainObject(o)) throw new Error(`invalid type`)

  for (const [section, ids] of Object.entries(o)) {
    if (!validSections.includes(section)) {
      throw new Error(`invalid section: ${section}`)
    }

    if (!ids.map(String).every(isInt)) {
      throw new Error(`section ${section} contains invalid TeacherId`)
    }
  }

  return true
}

const validators = validationMiddleware(
  param('TermId')
    .isInt()
    .custom(id =>
      Term.findByPk(id, { attributes: ['TermId'] }).then(term => {
        if (!term) throw new Error('does not exist')
      })
    ),
  body('CourseId')
    .isInt()
    .custom(id =>
      Course.findByPk(id, {
        attributes: ['CourseId'],
        where: { type: 'supervised' }
      }).then(course => {
        if (!course) throw new Error('does not exist')
      })
    ),
  body('TeacherIdsBySection').custom(o => isValidTeacherIdsBySectionObject(o))
)

const handler = asyncHandler(async (req, res, next) => {
  const { TermId, CourseId, TeacherIdsBySection } = req.getData()

  const termCourseTeachers = await sequelize.transaction(async transaction => {
    const AllTeacherIds = []

    for (const [section, TeacherIds] of Object.entries(TeacherIdsBySection)) {
      AllTeacherIds.push(...TeacherIds)

      const oldEntries = await TermCourseTeacher.findAll({
        where: { TermId, CourseId, section }
      })

      const newEntries = TeacherIds.map(TeacherId => ({
        TermId: Number(TermId),
        CourseId: Number(CourseId),
        TeacherId: Number(TeacherId),
        section
      }))

      const toDelete = differenceBy(oldEntries, newEntries, 'TeacherId')
      const toUpdate = intersectionBy(oldEntries, newEntries, 'TeacherId')
      const toInsert = differenceBy(newEntries, oldEntries, 'TeacherId')

      const promises = [
        ...toDelete.map(item => item.destroy({ transaction })),
        ...toUpdate.map(item =>
          item.update(
            newEntries.find(
              ({ TeacherId }) => TeacherId === item.get('TeacherId')
            ),
            { transaction }
          )
        )
      ]

      await Promise.all(promises)

      if (toInsert.length) {
        await TermCourseTeacher.bulkCreate(toInsert, { transaction })
      }
    }

    return TermCourseTeacher.findAll({
      where: { TermId, CourseId },
      transaction
    })
  })

  const items = termCourseTeachers.map(formatModelData)

  res.status(200).json({
    data: {
      kind: 'TermCourseTeacher',
      items,
      totalItems: items.length
    },
    params: {
      TermId
    }
  })
})

module.exports.authorizer = authorize(PERMITS)
module.exports.handler = validators.concat(handler)
