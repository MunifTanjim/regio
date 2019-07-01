const models = require('../../database/index.js').models

const getModel = modelName => {
  const model = models[modelName]

  if (model) return model

  throw new Error('Invalid modelName')
}

module.exports = getModel
