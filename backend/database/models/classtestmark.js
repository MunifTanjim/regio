'use strict'

module.exports = (sequelize, DataTypes) => {
  const ClassTestMark = sequelize.define(
    'ClassTestMark',
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
      number: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      mark: {
        type: DataTypes.DECIMAL(5, 2)
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  ClassTestMark.associate = () => {}

  return ClassTestMark
}
