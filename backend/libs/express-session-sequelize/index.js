const Store = require('express-session').Store

const path = require('path')
const Op = require('sequelize').Op
const debug = require('debug')('express:session:sequelize')

const defaultOptions = {
  cleanUpInterval: 15 * 60 * 1000,
  maxAge: 24 * 60 * 60 * 1000,
  dataField: 'data',
  extendData: () => ({})
}

const noOp = () => {}

const promiseAsCallback = (promise, callback = noOp) => {
  promise.then(data => callback(null, data)).catch(callback)
}

const getExpiresAt = (store, session) => {
  return session.cookie && session.cookie.expires
    ? session.cookie.expires
    : new Date(Date.now() + store.options.maxAge)
}

class SequelizeSessionStoreError extends Error {
  constructor(message) {
    super(message)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    this.name = this.constructor.name
  }
}

class SequelizeSessionStore extends Store {
  constructor(options = {}) {
    super(options)

    this.options = Object.assign({}, defaultOptions, options)

    if (!this.options.sequelize) {
      throw new SequelizeSessionStoreError('Sequelize instance is required')
    }

    if (this.options.model) {
      debug(`Using model: ${this.options.model} for sessions`)
      this.model =
        this.options.sequelize[options.model] ||
        this.options.sequelize.models[options.model]
    } else {
      debug('No model specified, using default model')
      this.model = this.options.sequelize.import(
        path.join(__dirname, 'model.js')
      )
    }

    this.idField = this.model.primaryKeyField
    this.dataField = this.options.dataField

    this.sync = this.sync.bind(this)
    this.get = this.get.bind(this)
    this.set = this.set.bind(this)
    this.destroy = this.destroy.bind(this)
    this.touch = this.touch.bind(this)
    this.length = this.length.bind(this)
    this.cleanUp = this.cleanUp.bind(this)
    this.startCleanUpSchedule = this.startCleanUpSchedule.bind(this)
    this.stopCleanUpSchedule = this.stopCleanUpSchedule.bind(this)

    this.startCleanUpSchedule()
  }

  sync() {
    return this.model.sync()
  }

  get(sid, callback) {
    debug(`GET: ${sid}`)

    const promise = this.model.findByPk(sid).then(session => {
      if (session) {
        debug(`FOUND: ${sid} => ${session.data}`)
        return JSON.parse(session.data)
      }

      debug(`NOT FOUND: ${sid}`)
      return null
    })

    return promiseAsCallback(promise, callback)
  }

  set(sid, session, callback) {
    debug(`SET: ${sid}`)

    const data = JSON.stringify(session)

    const sessionData = Object.assign(this.options.extendData(session), {
      [this.idField]: sid,
      [this.dataField]: data,
      expiresAt: getExpiresAt(this, session)
    })

    const promise = this.model.upsert(sessionData)

    return promiseAsCallback(promise, callback)
  }

  destroy(sid, callback) {
    debug(`DESTROY: ${sid}`)

    const promise = this.model.destroy({
      where: {
        [this.idField]: Array.isArray(sid) ? { [Op.in]: sid } : sid
      }
    })

    return promiseAsCallback(promise, callback)
  }

  touch(sid, session, callback) {
    debug(`TOUCH: ${sid}`)

    const promise = this.model.update(
      { expiresAt: getExpiresAt(this, session) },
      { where: { [this.idField]: sid } }
    )

    return promiseAsCallback(promise, callback)
  }

  length(callback) {
    const promise = this.model.count()

    return promiseAsCallback(promise, callback)
  }

  cleanUp(callback) {
    debug('CLEAN-UP')

    const promise = this.model.destroy({
      where: { expiresAt: { [Op.lt]: new Date() } }
    })

    return promiseAsCallback(promise, callback)
  }

  startCleanUpSchedule() {
    this.stopCleanUpSchedule()

    if (this.options.cleanUpInterval > 0) {
      this._cleanUpSchedule = setInterval(
        this.cleanUp,
        this.options.cleanUpInterval
      )

      // allow to terminate the node process even if this interval is still running
      this._cleanUpSchedule.unref()
    }
  }

  stopCleanUpSchedule() {
    if (this._cleanUpSchedule) {
      clearInterval(this._cleanUpSchedule)
      this._cleanUpSchedule = null
    }
  }
}

module.exports = SequelizeSessionStore
