const config = require('../configs/server.js')

const gracefulShutdownHandler = server => {
  console.log('Received kill signal! Attempting to shutdown gracefully...')

  server.close(err => {
    if (!err) {
      console.log('Graceful Shutdown: Successed!')
      process.exit(0)
    }
  })

  setTimeout(() => {
    console.error('Graceful Shutdown: Failed!')
    process.exit(1)
  }, config.get('express.killTimeout'))
}

module.exports = gracefulShutdownHandler
