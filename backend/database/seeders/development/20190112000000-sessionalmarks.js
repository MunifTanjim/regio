const bulkUpsert = require('../../helpers/queryinterface-bulk-upsert.js')

const rows = require('../../helpers/seeds/sessionalmarks.js')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await bulkUpsert(queryInterface, 'SessionalMarks', 'SessionalMark', rows)
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkDelete('ClassTestMarks', {
    // })
  }
}
