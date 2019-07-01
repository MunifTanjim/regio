'use strict'

const bulkUpsert = require('../../helpers/queryinterface-bulk-upsert.js')

const courseSeeds = require('../../helpers/seeds/courses.js')

const courseRows = courseSeeds

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await bulkUpsert(queryInterface, 'Courses', 'Course', courseRows)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Courses', {
      code: {
        [Sequelize.Op.in]: courseRows.map(({ code }) => code)
      }
    })
  }
}
