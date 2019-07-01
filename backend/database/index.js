const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const modelsPath = path.resolve('database', 'models')

const { url: connectionUri, ...config } = require('../configs/sequelize.js')

const sequelize = new Sequelize(connectionUri, config)

const models = {}

fs.readdirSync(modelsPath)
  .filter(fileName => fileName[0] !== '.' && path.extname(fileName) === '.js')
  .map(fileName => path.join(modelsPath, fileName))
  .forEach(filePath => {
    const model = sequelize.import(filePath)
    models[model.name] = model
  })

Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models))

module.exports = {
  ...models,
  models,
  sequelize,
  Sequelize
}
