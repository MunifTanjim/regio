'use strict'

const createTriggerUpdated = require('../helpers/create-trigger-updated.js')

const tableName = 'Terms'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(tableName, {
      TermId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      SessionYearId: {
        allowNull: false,
        type: Sequelize.STRING(9),
        onDelete: 'restrict',
        onUpdate: 'cascade',
        references: {
          model: 'SessionYears',
          key: 'SessionYearId'
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
      level: {
        allowNull: false,
        type: Sequelize.ENUM(['1', '2', '3', '4'])
      },
      term: {
        allowNull: false,
        type: Sequelize.ENUM(['1', '2'])
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

    await queryInterface.addConstraint(
      tableName,
      ['SessionYearId', 'level', 'term'],
      { type: 'unique', name: 'Terms_unique_constraint' }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(tableName)
  }
}
