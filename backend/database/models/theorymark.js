'use strict'

module.exports = (sequelize, DataTypes) => {
  const TheoryMark = sequelize.define(
    'TheoryMark',
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
      CourseId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'Courses',
          key: 'CourseId'
        }
      },
      StudentId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: 'Students',
          key: 'StudentId'
        }
      },
      attendance: {
        type: DataTypes.DECIMAL(5, 2)
      },
      classTests: {
        type: DataTypes.DECIMAL(5, 2)
      },
      finalExamSectionA: {
        type: DataTypes.DECIMAL(5, 2)
      },
      finalExamSectionB: {
        type: DataTypes.DECIMAL(5, 2)
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  TheoryMark.associate = () => {}

  return TheoryMark
}
