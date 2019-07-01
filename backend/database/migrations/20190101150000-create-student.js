'use strict'

const createTriggerUpdated = require('../helpers/create-trigger-updated.js')

const tableName = 'Students'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(tableName, {
      StudentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        allowNull: false,
        type: Sequelize.STRING,
        onDelete: 'cascade',
        onUpdate: 'cascade',
        references: {
          model: 'Users',
          key: 'UserId'
        }
      },
      BatchId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'restrict',
        onUpdate: 'cascade',
        references: {
          model: 'Batches',
          key: 'BatchId'
        }
      },
      adviserId: {
        type: Sequelize.INTEGER,
        onDelete: 'restrict',
        onUpdate: 'cascade',
        references: {
          model: 'Teachers',
          key: 'TeacherId'
        }
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
