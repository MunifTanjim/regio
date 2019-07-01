'use strict'

module.exports = (sequelize, DataTypes) => {
  const ResearchMark = sequelize.define(
    'ResearchMark',
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
      viva: {
        type: DataTypes.DECIMAL(5, 2)
      },
      external: {
        type: DataTypes.DECIMAL(5, 2)
      },
      internal: {
        type: DataTypes.DECIMAL(5, 2)
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  ResearchMark.associate = ({ Course, Student, Term }) => {
    ResearchMark.Course = ResearchMark.belongsTo(Course, {
      foreignKey: 'CourseId'
    })

    ResearchMark.Student = ResearchMark.belongsTo(Student, {
      foreignKey: 'StudentId'
    })

    ResearchMark.Term = ResearchMark.belongsTo(Term, {
      foreignKey: 'TermId'
    })
  }

  return ResearchMark
}
