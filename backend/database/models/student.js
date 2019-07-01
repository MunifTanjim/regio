'use strict'

module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    'Student',
    {
      StudentId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      UserId: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {
          model: 'Users',
          key: 'UserId'
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
      adviserId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Teachers',
          key: 'TeacherId'
        }
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  Student.associate = ({ Batch, Course, Enrollment, User, Teacher }) => {
    Student.User = Student.belongsTo(User, { foreignKey: 'UserId' })
    Student.Batch = Student.belongsTo(Batch, { foreignKey: 'BatchId' })

    Student.Courses = Student.belongsToMany(Course, {
      through: Enrollment,
      foreignKey: 'StudentId',
      otherKey: 'CourseId'
    })

    Student.Enrollments = Student.hasMany(Enrollment, {
      foreignKey: 'StudentId'
    })

    Student.Adviser = Student.belongsTo(Teacher, { foreignKey: 'adviserId' })
  }

  return Student
}
