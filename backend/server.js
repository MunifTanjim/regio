const debug = require('debug')('regio')
const http = require('http')

const app = require('./app')
const gracefulShutdownHandler = require('./handlers/graceful-shutdown-handler.js')

const { Sequelize, sequelize } = require('./database/index.js')

const config = require('./configs/server.js')
const port = config.get('port')

app.set('port', port)

const server = http.createServer(app)

sequelize
  .authenticate()
  .then(() => server.listen(port))
  .catch(err => {
    if (err instanceof Sequelize.ConnectionError) {
      console.error(`Error connecting to database ${err}`)
      process.kill(process.pid, 'SIGINT')
    } else {
      throw err
    }
  })

server.on('error', error => {
  if (error.syscall !== 'listen') {
    throw error
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${port} requires elevated privileges`)
      process.exit(1)
    case 'EADDRINUSE':
      console.error(`Port ${port} is already in use`)
      process.exit(1)
    default:
      throw error
  }
})

server.on('listening', () => {
  debug(`Server started!`)
  console.log(`Listening to port: ${app.get('port')}`)
})

process.on('SIGINT', () => gracefulShutdownHandler(server))
process.on('SIGTERM', () => gracefulShutdownHandler(server))
