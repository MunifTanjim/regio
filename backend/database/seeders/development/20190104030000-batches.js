'use strict'

const bulkUpsert = require('../../helpers/queryinterface-bulk-upsert.js')

const batchSeeds = require('../../helpers/seeds/batches.js')

const batchRows = Object.entries(batchSeeds).map(([BatchId, data]) => ({
  BatchId,
  ...data
}))

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await bulkUpsert(queryInterface, 'Batches', 'Batch', batchRows)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Batches', {
      BatchId: {
        [Sequelize.Op.in]: batchRows.map(({ BatchId }) => BatchId)
      }
    })
  }
}
