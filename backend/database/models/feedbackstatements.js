'use strict'
module.exports = (sequelize, DataTypes) => {
  const StudentFeedbackQuestions = sequelize.define(
    'FeedbackStatement',
    {
      FeedbackStatementId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      statement: {
        allowNull: false,
        type: DataTypes.STRING
      },
      toComment: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
      toRate: {
        allowNull: false,
        defaultValue: true,
        type: DataTypes.BOOLEAN
      }
    },
    { createdAt: 'created', updatedAt: 'updated' }
  )

  StudentFeedbackQuestions.associate = () => {}

  return StudentFeedbackQuestions
}
