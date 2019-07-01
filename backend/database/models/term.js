'use strict'

module.exports = (sequelize, DataTypes) => {
  const Term = sequelize.define(
    'Term',
    {
      TermId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      SessionYearId: {
        allowNull: false,
        type: DataTypes.STRING(9),
        references: {
          model: 'SessionYears',
          key: 'SessionYearId'
        }
      },
      BatchId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Batches',
          key: 'BatchId'
        }
      },
      level: {
        allowNull: false,
        type: DataTypes.ENUM(['1', '2', '3', '4'])
      },
      term: {
        allowNull: false,
        type: DataTypes.ENUM(['1', '2'])
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  Term.associate = ({
    Course,
    Enrollment,
    Research,
    SessionYear,
    TermCourse,
    TermCourseTeacher
  }) => {
    Term.SessionYear = Term.belongsTo(SessionYear, {
      foreignKey: 'SessionYearId'
    })

    Term.Enrollments = Term.hasMany(Enrollment, {
      foreignKey: 'TermId'
    })

    Term.Researches = Term.hasMany(Research, {
      foreignKey: 'TermId'
    })

    Term.Courses = Term.belongsToMany(Course, {
      through: TermCourse,
      foreignKey: 'TermId',
      otherKey: 'CourseId'
    })

    Term.TermCourses = Term.hasMany(TermCourse, { foreignKey: 'TermId' })
    Term.TermCourseTeachers = Term.hasMany(TermCourseTeacher, {
      foreignKey: 'TermId'
    })
  }

  return Term
}
