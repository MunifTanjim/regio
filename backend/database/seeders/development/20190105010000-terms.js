'use strict'

const termSeeds = require('../../helpers/seeds/terms.js')

const termRows = termSeeds

const { Term } = require('../../index.js')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      for (const termRow of termRows) {
        const exists = await Term.findOne({
          where: termRow,
          transaction
        })

        if (exists) continue

        await Term.create(termRow, { transaction })
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await Term.destroy({
      where: {
        [Sequelize.Op.or]: termRows
      }
    })
  }
}
