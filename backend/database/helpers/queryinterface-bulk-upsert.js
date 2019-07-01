const queryInterfaceUpsert = require('./queryinterface-upsert.js')

const bulkUpsertPromise = (
  queryInterface,
  tableName,
  modelName,
  rows,
  options
) => {
  return Promise.all(
    rows.map(row =>
      queryInterfaceUpsert(queryInterface, tableName, modelName, row, options)
    )
  )
}

module.exports = (queryInterface, tableName, modelName, rows, options = {}) => {
  return options.transaction
    ? bulkUpsertPromise(queryInterface, tableName, modelName, rows, options)
    : queryInterface.sequelize.transaction(transaction =>
        bulkUpsertPromise(queryInterface, tableName, modelName, rows, {
          ...options,
          transaction
        })
      )
}
