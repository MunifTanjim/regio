'use strict'

module.exports = (sequelize, DataTypes) => {
  const SessionalMark = sequelize.define(
    'SessionalMark',
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
      performanceAndReports: {
        type: DataTypes.DECIMAL(5, 2)
      },
      finalQuiz: {
        type: DataTypes.DECIMAL(5, 2)
      },
      finalViva: {
        type: DataTypes.DECIMAL(5, 2)
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  SessionalMark.associate = ({ Course, Student, Term }) => {
    SessionalMark.Course = SessionalMark.belongsTo(Course, {
      foreignKey: 'CourseId'
    })

    SessionalMark.Student = SessionalMark.belongsTo(Student, {
      foreignKey: 'StudentId'
    })

    SessionalMark.Term = SessionalMark.belongsTo(Term, {
      foreignKey: 'TermId'
    })
  }

  return SessionalMark
}
