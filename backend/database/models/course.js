'use strict'

const { types } = require('../helpers/models/courses.js')

module.exports = (sequelize, DataTypes) => {
  const validTypes = types

  const Course = sequelize.define(
    'Course',
    {
      CourseId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      code: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING
      },
      creditHr: {
        allowNull: false,
        type: DataTypes.DECIMAL(4, 2)
      },
      type: {
        allowNull: false,
        defaultValue: 'theory',
        type: DataTypes.ENUM(validTypes)
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  Course.associate = ({
    Research,
    Teacher,
    Term,
    TermCourse,
    TermCourseTeacher
  }) => {
    Course.Terms = Course.belongsToMany(Term, {
      through: TermCourse,
      foreignKey: 'CourseId',
      otherKey: 'TermId'
    })

    Course.TermCourses = Course.hasMany(TermCourse, { foreignKey: 'CourseId' })
    Course.TermCourseTeachers = Course.hasMany(TermCourseTeacher, {
      foreignKey: 'CourseId'
    })

    Course.Researches = Course.hasMany(Research, {
      foreignKey: 'CourseId'
    })

    Course.Teachers = Course.belongsToMany(Teacher, {
      through: TermCourseTeacher,
      foreignKey: 'CourseId',
      otherKey: 'TeacherId'
    })
  }

  Course.validTypes = validTypes

  return Course
}
