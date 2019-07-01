const uniq = require('lodash/uniq')

module.exports = model =>
  uniq(
    model.primaryKeyAttributes.concat(
      ...Object.values(model.uniqueKeys).map(item => item.fields)
    )
  )
