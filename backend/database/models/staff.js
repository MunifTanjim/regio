'use strict'

module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define(
    'Staff',
    {
      StaffId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER
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
    { createdAt: 'created', updatedAt: 'updated' }
  )

  Staff.associate = ({ User }) => {
    Staff.User = Staff.belongsTo(User, { foreignKey: 'UserId' })
  }

  return Staff
}
