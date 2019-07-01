const express = require('express')

const sessionMiddleware = require('./libs/express-session.js')
const errorHandlers = require('./handlers/error-handlers.js')

const { injectRoutes } = require('./routes/index.js')

const config = require('./configs/server.js')

const app = express()

app.use(express.json())

app.use(sessionMiddleware())

if (!['development'].includes(config.get('env'))) {
  app.set('trust proxy', 1)
}

injectRoutes(app)

app.use(errorHandlers.notFoundHandler)
app.use(errorHandlers.responseHandler)
app.use(errorHandlers.logHandler)

module.exports = app
