'use strict'

const createTriggerUpdated = require('../helpers/create-trigger-updated.js')

const tableName = 'StudentFeedbacks'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(tableName, {
      StudentFeedbackId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TermId: {
        allowNull: false,
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
        type: Sequelize.INTEGER,
        onDelete: 'restrict',
        onUpdate: 'cascade',
        references: {
          model: 'Courses',
          key: 'CourseId'
        }
      },
      TeacherId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'cascade',
        onUpdate: 'cascade',
        references: {
          model: 'Teachers',
          key: 'TeacherId'
        }
      },
      FeedbackStatementId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete: 'restrict',
        onUpdate: 'cascade',
        references: {
          model: 'FeedbackStatements',
          key: 'FeedbackStatementId'
        }
      },
      comment: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.TEXT
      },
      rate: {
        allowNull: false,
        defaultValue: '0',
        type: Sequelize.ENUM(['-1', '-2', '0', '1', '2'])
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
