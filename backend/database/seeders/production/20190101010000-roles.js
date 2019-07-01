const bulkUpsert = require('../../helpers/queryinterface-bulk-upsert.js')

const roleSeeds = require('../../helpers/seeds/roles.js')

const roleRows = Object.entries(roleSeeds).map(([RoleId, data]) => ({
  RoleId,
  ...data
}))

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await bulkUpsert(queryInterface, 'Roles', 'Role', roleRows)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', {
      RoleId: {
        [Sequelize.Op.in]: roleRows.map(({ RoleId }) => RoleId)
      }
    })
  }
}
