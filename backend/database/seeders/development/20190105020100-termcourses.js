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

const getTermcourseRows = async (queryInterface, Sequelize, transaction) => {
  const rows = []

  for (const {
    term: termObject,
    data,
    startDate,
    endDate
  } of termcourseSeeds) {
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

    data.forEach(({ CourseCode }) => {
      rows.push({
        TermId,
        CourseId: Courses[CourseCode],
        startDate,
        endDate
      })
    })
  }

  return rows
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const rows = await getTermcourseRows(
        queryInterface,
        Sequelize,
        transaction
      )

      await bulkUpsert(queryInterface, 'TermCourses', 'TermCourse', rows, {
        transaction
      })
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const rows = await getTermcourseRows(
        queryInterface,
        Sequelize,
        transaction
      )

      await queryInterface.bulkDelete(
        'TermCourses',
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
