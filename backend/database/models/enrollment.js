'use strict'

const { col } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  const validTypes = ['regular', 'short', 'backlog']

  const Enrollment = sequelize.define(
    'Enrollment',
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
      section: {
        allowNull: false,
        defaultValue: 'A',
        type: DataTypes.STRING
      },
      approved: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      type: {
        allowNull: false,
        defaultValue: 'regular',
        type: DataTypes.ENUM(validTypes)
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  Enrollment.associate = ({ Student, Term, TermCourse }) => {
    Enrollment.TermCourse = Enrollment.belongsTo(TermCourse, {
      foreignKey: 'TermId',
      scope: {
        CourseId: col('Enrollment.CourseId')
      }
    })

    Enrollment.Term = Enrollment.belongsTo(Term, {
      foreignKey: 'TermId'
    })

    Enrollment.Student = Enrollment.belongsTo(Student, {
      foreignKey: 'StudentId'
    })
  }

  Enrollment.validTypes = validTypes

  return Enrollment
}
