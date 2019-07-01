'use strict'

module.exports = (sequelize, DataTypes) => {
  const validDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const Routine = sequelize.define(
    'Routine',
    {
      TermId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        onDelete: 'cascade',
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
        type: DataTypes.STRING
      },
      day: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.ENUM(validDays)
      },
      CourseId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        onDelete: 'cascade',
        onUpdate: 'cascade',
        references: {
          model: 'Courses',
          key: 'CourseId'
        }
      },
      RoutineSlotIds: {
        allowNull: false,
        type: DataTypes.ARRAY(DataTypes.INTEGER)
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  Routine.associate = () => {}

  Routine.validDays = validDays

  return Routine
}
