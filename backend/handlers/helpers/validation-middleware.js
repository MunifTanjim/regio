const { validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

const RegioError = require('../../libs/error/regio-error.js')

const validationErrorFormatter = ({ param, msg: message }) => ({
  param,
  message
})

const resultMiddleware = (req, res, next) => {
  const validationErrors = validationResult(req).formatWith(
    validationErrorFormatter
  )

  if (!validationErrors.isEmpty()) {
    throw new RegioError(400, 'Validation Error', validationErrors.array())
  }

  req.getData = () => matchedData(req)

  next()
}

const validationMiddleware = (...validators) => {
  return validators.concat(resultMiddleware)
}

module.exports = validationMiddleware
