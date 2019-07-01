'use strict'

const createTriggerUpdated = require('../helpers/create-trigger-updated.js')

const tableName = 'Users'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(tableName, {
      UserId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      PersonId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'cascade',
        onUpdate: 'cascade',
        references: {
          model: 'Persons',
          key: 'PersonId'
        }
      },
      password: {
        allowNull: false,
        type: Sequelize.BLOB
      },
      approved: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
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
