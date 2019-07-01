'use strict'

const { col } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define(
    'Attendance',
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
      date: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.DATEONLY
      },
      section: {
        allowNull: false,
        defaultValue: 'A',
        primaryKey: true,
        type: DataTypes.STRING
      },
      StudentIds: {
        allowNull: false,
        type: DataTypes.ARRAY(DataTypes.INTEGER)
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  Attendance.associate = ({ TermCourse }) => {
    Attendance.TermCourse = Attendance.belongsTo(TermCourse, {
      foreignKey: 'TermId',
      scope: {
        CourseId: col('Attendance.CourseId')
      }
    })
  }

  return Attendance
}
