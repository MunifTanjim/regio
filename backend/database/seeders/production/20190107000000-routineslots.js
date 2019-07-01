const bulkUpsert = require('../../helpers/queryinterface-bulk-upsert.js')

const rows = require('../../helpers/seeds/routineslots.js')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await bulkUpsert(queryInterface, 'RoutineSlots', 'RoutineSlot', rows)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('RoutineSlots', {
      RoutineSlotId: {
        [Sequelize.Op.in]: rows.map(({ RoutineSlotId }) => RoutineSlotId)
      }
    })
  }
}
