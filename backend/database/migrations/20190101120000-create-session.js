'use strict'

const tableName = 'Sessions'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(tableName, {
      SessionId: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true
      },
      data: {
        allowNull: false,
        type: Sequelize.JSON
      },
      expiresAt: {
        allowNull: false,
        type: Sequelize.DATE
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
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(tableName)
  }
}
