'use strict'

const createTriggerUpdated = require('../helpers/create-trigger-updated.js')

const tableName = 'Researches'

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
      CourseId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        onDelete: 'restrict',
        onUpdate: 'cascade',
        references: {
          model: 'Courses',
          key: 'CourseId'
        }
      },
      StudentId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        onDelete: 'cascade',
        onUpdate: 'cascade',
        references: {
          model: 'Students',
          key: 'StudentId'
        }
      },
      TeacherId: {
        allowNull: false,
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
