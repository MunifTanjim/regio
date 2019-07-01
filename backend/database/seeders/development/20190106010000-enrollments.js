'use strict'

const memoize = require('lodash/memoize')

const bulkUpsert = require('../../helpers/queryinterface-bulk-upsert.js')

const enrollmentSeeds = require('../../helpers/seeds/enrollments.js')

const {
  Course,
  Term,
  ResearchMark,
  SessionalMark,
  TheoryMark
} = require('../../index.js')

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

const getCourseType = memoize(async (CourseId, transaction) => {
  const course = await Course.findByPk(CourseId, {
    attributes: ['type'],
    transaction
  })
  const type = course.get('type')

  return type
})

const getEnrollmentRows = async (queryInterface, Sequelize, transaction) => {
  const rows = []

  for (const {
    termObject,
    CourseCodes,
    StudentIds,
    approved
  } of enrollmentSeeds) {
    const TermId = await getTermId(termObject, transaction)

    const courses = await Course.findAll({
      attributes: ['CourseId', 'code'],
      where: {
        [Sequelize.Op.or]: CourseCodes.map(code => ({ code }))
      },
      transaction
    })

    const Courses = courses.reduce((Courses, course) => {
      Courses[course.get('code')] = course.get('CourseId')
      return Courses
    }, {})

    StudentIds.forEach(StudentId => {
      Object.values(Courses).forEach(CourseId => {
        rows.push({
          TermId,
          CourseId,
          StudentId,
          approved
        })
      })
    })
  }

  return rows
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const rows = await getEnrollmentRows(
        queryInterface,
        Sequelize,
        transaction
      )

      await bulkUpsert(queryInterface, 'Enrollments', 'Enrollment', rows, {
        transaction
      })

      const promises = []

      for (const { TermId, CourseId, StudentId } of rows) {
        const type = await getCourseType(CourseId, transaction)

        if (type === 'theory') {
          promises.push(
            TheoryMark.upsert({ TermId, CourseId, StudentId }, { transaction })
          )
        }

        if (type === 'sessional') {
          promises.push(
            SessionalMark.upsert(
              { TermId, CourseId, StudentId },
              { transaction }
            )
          )
        }

        if (type === 'supervised') {
          promises.push(
            ResearchMark.upsert(
              { TermId, CourseId, StudentId },
              { transaction }
            )
          )
        }
      }

      await Promise.all(promises)
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      const rows = await getEnrollmentRows(
        queryInterface,
        Sequelize,
        transaction
      )

      await queryInterface.bulkDelete(
        'Enrollments',
        {
          [Sequelize.Op.or]: rows.map(({ TermId, CourseId, StudentId }) => ({
            TermId,
            CourseId,
            StudentId
          }))
        },
        { transaction }
      )
    })
  }
}
