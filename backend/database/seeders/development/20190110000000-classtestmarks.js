const bulkUpsert = require('../../helpers/queryinterface-bulk-upsert.js')

const rows = require('../../helpers/seeds/classtestmarks.js')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await bulkUpsert(queryInterface, 'ClassTestMarks', 'ClassTestMark', rows)
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkDelete('ClassTestMarks', {
    // })
  }
}
