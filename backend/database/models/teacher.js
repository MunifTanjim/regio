'use strict'

const { ranks } = require('../helpers/models/teacher.js')

module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define(
    'Teacher',
    {
      TeacherId: {
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
      },
      rank: {
        allowNull: false,
        type: DataTypes.ENUM(ranks)
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  Teacher.associate = ({ User, Student }) => {
    Teacher.User = Teacher.belongsTo(User, { foreignKey: 'UserId' })
  }

  return Teacher
}
