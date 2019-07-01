'use strict'

module.exports = (sequelize, DataTypes) => {
  const TermCourseTeacher = sequelize.define(
    'TermCourseTeacher',
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
      TeacherId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        onDelete: 'cascade',
        onUpdate: 'cascade',
        references: {
          model: 'Teachers',
          key: 'TeacherId'
        }
      },
      section: {
        allowNull: false,
        defaultValue: 'A',
        primaryKey: true,
        type: DataTypes.STRING
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  TermCourseTeacher.associate = ({ Course, Teacher, Term }) => {
    TermCourseTeacher.Term = TermCourseTeacher.belongsTo(Term, {
      foreignKey: 'TermId'
    })
    TermCourseTeacher.Course = TermCourseTeacher.belongsTo(Course, {
      foreignKey: 'CourseId'
    })
    TermCourseTeacher.Teacher = TermCourseTeacher.belongsTo(Teacher, {
      foreignKey: 'TeacherId'
    })
  }

  return TermCourseTeacher
}
