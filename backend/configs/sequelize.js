const config = require('./server.js')

module.exports = {
  dialect: 'postgres',
  url: config.get('database.connectionUri'),
  logging: false
}
