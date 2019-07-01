const getUpdateValues = require('./get-update-values.js')
const getWhere = require('./get-where.js')

module.exports = (queryInterface, tableName, modelName, row, options = {}) => {
  const model = require('../index.js')[modelName]

  const updateValues = getUpdateValues(row, model)
  const where = getWhere(row, model)

  return Object.keys(updateValues).length
    ? queryInterface.upsert(tableName, row, updateValues, where, model, options)
    : queryInterface.bulkInsert(tableName, [row], {
        ...options,
        ignoreDuplicates: true
      })
}
