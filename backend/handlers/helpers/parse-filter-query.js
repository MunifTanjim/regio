const get = require('lodash/get')
const set = require('lodash/set')

const {
  Sequelize: { Op }
} = require('../../database/index.js')

const opMap = {
  '==': Op.eq,
  '=={}': Op.in,
  '!=': Op.ne,
  '!={}': Op.notIn
}

const valueMap = {
  null: null,
  true: true,
  false: false
}

const isSetValue = value => /^\{.+\}$/.test(value)

const transformValue = value => get(valueMap, value, value)

const getConditionObject = (operator, value) => {
  if (isSetValue(value)) {
    operator = opMap[`${operator}{}`]
    value = value
      .slice(1, -1)
      .split('|')
      .map(transformValue)
  } else {
    operator = opMap[operator]
    value = transformValue(value)
  }

  return {
    [operator]: value
  }
}

const parseFilterQuery = (filterString = '') => {
  const filters = filterString.split(',')

  return filters.reduce((where, filter) => {
    const match = filter.match(/([\w.]+)([=!]{1,3})(.+)/)

    if (!match) return where

    const [, field, operator, value] = match

    set(where, field, getConditionObject(operator, value))

    return where
  }, {})
}

module.exports = parseFilterQuery
