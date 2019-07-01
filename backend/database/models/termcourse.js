'use strict'

const { col } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  const TermCourse = sequelize.define(
    'TermCourse',
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
      startDate: {
        allowNull: false,
        type: DataTypes.DATEONLY
      },
      endDate: {
        type: DataTypes.DATEONLY
      },
      feedbackOpen: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  TermCourse.associate = ({ Attendance, Course, Enrollment, Term }) => {
    TermCourse.Term = TermCourse.belongsTo(Term, { foreignKey: 'TermId' })
    TermCourse.Course = TermCourse.belongsTo(Course, { foreignKey: 'CourseId' })

    TermCourse.Attendances = TermCourse.hasMany(Attendance, {
      foreignKey: 'TermId',
      scope: {
        CourseId: col('TermCourse.CourseId')
      }
    })
    TermCourse.Enrollments = TermCourse.hasMany(Enrollment, {
      foreignKey: 'TermId',
      scope: {
        CourseId: col('TermCourse.CourseId')
      }
    })
  }

  return TermCourse
}
