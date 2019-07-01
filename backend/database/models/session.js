'use strict'

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define(
    'Session',
    {
      SessionId: {
        allowNull: false,
        type: DataTypes.UUID,
        primaryKey: true
      },
      data: {
        allowNull: false,
        type: DataTypes.JSON
      },
      expiresAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      UserId: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {
          model: 'Users',
          key: 'UserId'
        }
      }
    },
    {
      timestamps: false
    }
  )

  Session.associate = ({ User }) => {
    Session.User = Session.belongsTo(User, { foreignKey: 'UserId' })
  }

  return Session
}
