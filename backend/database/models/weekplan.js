'use strict'

module.exports = (sequelize, DataTypes) => {
  const validDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const WeekPlan = sequelize.define(
    'WeekPlan',
    {
      TermId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'Terms',
          key: 'TermId'
        }
      },
      section: {
        allowNull: false,
        defaultValue: 'A',
        primaryKey: true,
        type: DataTypes.STRING
      },
      weekNumber: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      day: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.ENUM(validDays)
      },
      note: {
        allowNull: false,
        defaultValue: '',
        type: DataTypes.STRING
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  WeekPlan.associate = () => {}

  WeekPlan.validDays = validDays

  return WeekPlan
}
