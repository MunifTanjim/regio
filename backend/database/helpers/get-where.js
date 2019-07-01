const { Op } = require('sequelize')

const getUniqueFields = require('./get-unique-fields.js')

module.exports = (insertValues, model) => {
  return getUniqueFields(model).reduce(
    (where, field) => {
      if (typeof insertValues[field] === 'undefined') return where

      where[Op.and].push({ [field]: insertValues[field] })
      return where
    },
    { [Op.and]: [] }
  )
}
