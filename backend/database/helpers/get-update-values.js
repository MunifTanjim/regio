const getUniqueFields = require('./get-unique-fields.js')

module.exports = (insertValues, model) => {
  const uniqueFields = getUniqueFields(model)

  return Object.keys(insertValues)
    .filter(field => !uniqueFields.includes(field))
    .reduce((values, field) => {
      values[field] = insertValues[field]
      return values
    }, {})
}
