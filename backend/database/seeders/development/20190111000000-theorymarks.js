const bulkUpsert = require('../../helpers/queryinterface-bulk-upsert.js')

const rows = require('../../helpers/seeds/theorymarks.js')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await bulkUpsert(queryInterface, 'TheoryMarks', 'TheoryMark', rows)
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkDelete('ClassTestMarks', {
    // })
  }
}
