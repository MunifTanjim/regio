'use strict'

module.exports = (sequelize, DataTypes) => {
  const StudentFeedbackTrackers = sequelize.define(
    'StudentFeedbackTracker',
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
      FeedbackStatementId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        onDelete: 'cascade',
        onUpdate: 'cascade',
        references: {
          model: 'FeedbackStatements',
          key: 'FeedbackStatementId'
        }
      },
      StudentId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        onDelete: 'cascade',
        onUpdate: 'cascade',
        references: {
          model: 'Students',
          key: 'StudentId'
        }
      }
    },
    {
      timestamps: false
    }
  )

  StudentFeedbackTrackers.associate = () => {}

  return StudentFeedbackTrackers
}
