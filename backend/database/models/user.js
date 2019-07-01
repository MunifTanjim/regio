'use strict'

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      UserId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING
      },
      PersonId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Persons',
          key: 'PersonId'
        }
      },
      password: {
        allowNull: false,
        type: DataTypes.BLOB
      },
      approved: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  User.associate = ({ Person, Role, Session }) => {
    User.Person = User.belongsTo(Person, { foreignKey: 'PersonId' })
    User.Sessions = User.hasMany(Session, { foreignKey: 'UserId' })
    User.Roles = User.belongsToMany(Role, {
      through: 'UserRoles',
      foreignKey: 'UserId',
      otherKey: 'RoleId'
    })
  }

  return User
}
