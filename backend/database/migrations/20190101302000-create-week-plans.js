'use strict'

const createTriggerUpdated = require('../helpers/create-trigger-updated.js')

const tableName = 'WeekPlans'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(tableName, {
      TermId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        onDelete: 'restrict',
        onUpdate: 'cascade',
        references: {
          model: 'Terms',
          key: 'TermId'
        }
      },
      section: {
        allowNull: false,
        defaultValue: 'A',
        primaryKey: true,
        type: Sequelize.STRING
      },
      weekNumber: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      day: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.ENUM(['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'])
      },
      note: {
        allowNull: false,
        defaultValue: '',
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
