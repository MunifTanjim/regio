const RegioError = require('../libs/error/regio-error.js')

const notFoundHandler = (req, res, next) => {
  throw new RegioError(404, `not found`, [{ path: req.url }])
}

const responseHandler = (err, req, res, next) => {
  const errorObject =
    err instanceof RegioError ? err : new RegioError(500, 'server problem', err)

  const error = errorObject.toJSON()

  if (errorObject.statusCode >= 500) {
    delete error.errors
  }

  res.status(errorObject.statusCode).json({
    error
  })

  next(errorObject)
}

const logHandler = (err, req, res, next) => {
  console.error(err)
}

module.exports = {
  notFoundHandler,
  responseHandler,
  logHandler
}
