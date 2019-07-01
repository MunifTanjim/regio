'use strict'

const bulkUpsert = require('../../helpers/queryinterface-bulk-upsert.js')

const sessionyearSeeds = require('../../helpers/seeds/sessionyears.js')

const sessionyearRows = Object.entries(sessionyearSeeds).map(
  ([SessionYearId, data]) => ({
    SessionYearId,
    ...data
  })
)

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await bulkUpsert(
      queryInterface,
      'SessionYears',
      'SessionYear',
      sessionyearRows
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('SessionYears', {
      SessionYearId: {
        [Sequelize.Op.in]: sessionyearRows.map(
          ({ SessionYearId }) => SessionYearId
        )
      }
    })
  }
}
