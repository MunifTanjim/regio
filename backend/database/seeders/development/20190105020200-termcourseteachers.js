'use strict'

const memoize = require('lodash/memoize')

const bulkUpsert = require('../../helpers/queryinterface-bulk-upsert.js')

const termcourseSeeds = require('../../helpers/seeds/termcourses.js')

const { Course, Term } = require('../../index.js')

const getTermId = memoize(
  async ({ SessionYearId, level, term }, transaction) => {
    const termModel = await Term.findOne({
      attributes: ['TermId'],
      where: { SessionYearId, level, term },
      transaction
    })

    const TermId = termModel.get('TermId')

    return TermId
  }
)

const getTermCourseTeacherRows = async (
  queryInterface,
  Sequelize,
  transaction
) => {
  const rows = []

  for (const { term: termObject, data } of termcourseSeeds) {
    const TermId = await getTermId(termObject, transaction)

    const courses = await Course.findAll({
      attributes: ['CourseId', 'code'],
      where: {
        [Sequelize.Op.or]: data.map(({ CourseCode: code }) => ({ code }))
      },
      transaction
    })

    const Courses = courses.reduce((Courses, course) => {
      Courses[course.get('code')] = course.get('CourseId')
      return Courses
    }, {})

    data.forEach(({ CourseCode, TeacherIdsBySection }) => {
      Object.entries(TeacherIdsBySection).forEach(([section, TeacherIds]) => {
        rows.push(
          ...TeacherIds.map(TeacherId => ({
            TermId,
            CourseId: Courses[CourseCode],
            TeacherId,
            section
          }))
        )
      })
    })
  }

  return rows
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const rows = await getTermCourseTeacherRows(
        queryInterface,
        Sequelize,
        transaction
      )

      await bulkUpsert(
        queryInterface,
        'TermCourseTeachers',
        'TermCourseTeacher',
        rows,
        { transaction }
      )
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const rows = await getTermCourseTeacherRows(
        queryInterface,
        Sequelize,
        transaction
      )

      await queryInterface.bulkDelete(
        'TermCourseTeachers',
        {
          [Sequelize.Op.or]: rows.map(({ TermId, CourseId }) => ({
            TermId,
            CourseId
          }))
        },
        { transaction }
      )
    })
  }
}
