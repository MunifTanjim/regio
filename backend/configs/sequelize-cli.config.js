const config = require('./server.js')

const env = config.get('env')

const sequelizeConfig = require('./sequelize.js')

const debug = process.env.DEBUG

module.exports = {
  [env]: {
    ...sequelizeConfig,
    url: process.env.CLI_DATABASE_CONNECTION_URI,
    logging: debug ? console.log : false
  }
}
