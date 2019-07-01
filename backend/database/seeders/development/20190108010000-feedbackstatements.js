const bulkUpsert = require('../../helpers/queryinterface-bulk-upsert.js')

const rows = require('../../helpers/seeds/feedbackstatements.js')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await bulkUpsert(
      queryInterface,
      'FeedbackStatements',
      'FeedbackStatement',
      rows
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('FeedbackStatements', {
      FeedbackStatementId: {
        [Sequelize.Op.in]: rows.map(
          ({ FeedbackStatementId }) => FeedbackStatementId
        )
      }
    })
  }
}
