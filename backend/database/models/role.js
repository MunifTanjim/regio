module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      RoleId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: DataTypes.STRING
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  Role.associate = ({ User }) => {
    Role.Users = Role.belongsToMany(User, {
      through: 'UserRoles',
      foreignKey: 'RoleId',
      otherKey: 'UserId'
    })
  }

  return Role
}
