const isPlainObject = require('lodash/isPlainObject')
const isObjectLike = require('lodash/isObjectLike')
const isArray = require('lodash/isArray')
const toLower = require('lodash/toLower')
const toUpper = require('lodash/toUpper')

const getModel = require('./get-model.js')
const getModelPrimaryKeyField = require('./get-model-primary-key-field.js')

const isUpper = c => c === toUpper(c) && c !== toLower(c)

const formatModelData = model => {
  if (isArray(model)) return model.map(formatModelData)

  if (!isObjectLike(model)) return model

  const modelName = model._modelOptions.name

  const Model = getModel(modelName.singular)

  const idField = getModelPrimaryKeyField(Model)

  const data = {
    // kind: modelName.singular,
    id: Array.isArray(idField)
      ? idField.map(field => model.get(field)).join('_')
      : model.get(idField),
    ...model.toJSON()
  }

  if (!Array.isArray(idField)) {
    delete data[idField]
  }

  Object.keys(data)
    .filter(field => isUpper(field[0]))
    .forEach(field => {
      data[field] =
        isPlainObject(data[field]) || isArray(data[field])
          ? formatModelData(model[field])
          : data[field]
    })

  return data
}

module.exports = formatModelData
