const bulkUpsert = require('../../helpers/queryinterface-bulk-upsert.js')

const rows = require('../../helpers/seeds/attendances.js')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await bulkUpsert(queryInterface, 'Attendances', 'Attendance', rows)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Attendances', {
      date: {
        [Sequelize.Op.in]: rows.map(({ date }) => date)
      }
    })
  }
}
