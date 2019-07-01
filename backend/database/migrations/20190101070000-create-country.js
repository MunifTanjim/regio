'use strict'

const createTriggerUpdated = require('../helpers/create-trigger-updated.js')

const tableName = 'Countries'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(tableName, {
      CountryId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.SMALLINT
      },
      code: {
        allowNull: false,
        type: Sequelize.STRING(2)
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      callingCodes: {
        allowNull: false,
        defaultValue: Sequelize.literal('ARRAY[]::SMALLINT[]'),
        type: Sequelize.ARRAY(Sequelize.SMALLINT)
      },
      created: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      },
      updated: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      }
    })

    await createTriggerUpdated(queryInterface, tableName)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(tableName)
  }
}
