'use strict'

const bulkUpsert = require('../../helpers/queryinterface-bulk-upsert.js')

const countryList = require('../../helpers/seeds/countries.js')

const formatCallingCodes = (callingCodes, Sequelize) => {
  const arr = callingCodes
    .map(string => string.replace(/\s/g, ''))
    .filter(Boolean)
    .map(Number)

  return arr.length ? arr : Sequelize.literal('ARRAY[]::SMALLINT[]')
}

const getCountryRows = Sequelize => {
  return countryList
    .map(
      ({ name, alpha2Code: code, callingCodes, numericCode: CountryId }) => ({
        CountryId,
        code,
        name,
        callingCodes: formatCallingCodes(callingCodes, Sequelize)
      })
    )
    .filter(({ CountryId }) => Boolean(CountryId))
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const countryRows = getCountryRows(Sequelize)

    await bulkUpsert(queryInterface, 'Countries', 'Country', countryRows)
  },

  down: async (queryInterface, Sequelize) => {
    const countryRows = getCountryRows(Sequelize)

    await queryInterface.bulkDelete('Countries', {
      CountryId: {
        [Sequelize.Op.in]: countryRows.map(({ CountryId }) => CountryId)
      }
    })
  }
}
