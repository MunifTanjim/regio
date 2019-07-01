'use strict'

module.exports = (sequelize, DataTypes) => {
  const StudentFeedbacks = sequelize.define(
    'StudentFeedback',
    {
      StudentFeedbackId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      TermId: {
        allowNull: false,
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
        type: DataTypes.INTEGER,
        onDelete: 'cascade',
        onUpdate: 'cascade',
        references: {
          model: 'FeedbackStatements',
          key: 'FeedbackStatementId'
        }
      },
      comment: {
        allowNull: false,
        defaultValue: '',
        type: DataTypes.TEXT
      },
      rate: {
        allowNull: false,
        defaultValue: '0',
        type: DataTypes.ENUM(['-1', '-2', '0', '1', '2'])
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  StudentFeedbacks.associate = () => {}

  return StudentFeedbacks
}
