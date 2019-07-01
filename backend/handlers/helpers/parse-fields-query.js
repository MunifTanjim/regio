const uniq = require('lodash/uniq')

const parseFieldsQuery = (fieldsString, mustIncludes) => {
  const parsedFields = fieldsString ? fieldsString.split(',') : undefined

  return parsedFields && mustIncludes
    ? uniq(parsedFields.concat(mustIncludes))
    : parsedFields
}

module.exports = parseFieldsQuery
