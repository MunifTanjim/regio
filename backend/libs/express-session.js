const session = require('express-session')
const uuidv4 = require('uuid/v4')

const SequelizeSessionStore = require('../libs/express-session-sequelize/index.js')

const { sequelize } = require('../database/index.js')

const config = require('../configs/server.js')

const storeOptions = {
  sequelize,
  model: 'Session',
  extendData: session => ({
    UserId: session.user ? session.user.UserId : session.UserId
  })
}

const sessionStore = new SequelizeSessionStore(storeOptions)

const cookieOptions = {
  domain: config.get('cookie.domain'),
  httpOnly: true,
  secure: false,
  maxAge: config.get('cookie.maxAge')
}

const options = {
  cookie: cookieOptions,
  name: 'regio.sid',
  resave: false,
  proxy: true,
  saveUninitialized: false,
  secret: 'regio',
  unset: 'destroy',
  store: sessionStore,
  genid: uuidv4
}

const sessionMiddleware = () => session(options)

module.exports = sessionMiddleware
