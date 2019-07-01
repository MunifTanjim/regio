'use strict'

const createTriggerUpdated = require('../helpers/create-trigger-updated.js')

const tableName = 'UserRoles'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(tableName, {
      UserId: {
        onDelete: 'cascade',
        onUpdate: 'cascade',
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'UserId'
        },
        type: Sequelize.STRING
      },
      RoleId: {
        onDelete: 'cascade',
        onUpdate: 'cascade',
        primaryKey: true,
        references: {
          model: 'Roles',
          key: 'RoleId'
        },
        type: Sequelize.STRING
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
