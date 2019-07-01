const formatErrorsArray = errors => {
  if (!errors) return
  return Array.isArray(errors) ? errors : [errors]
}

class RegioError extends Error {
  constructor(statusCode, message, errors) {
    super(message)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    this.name = this.constructor.name
    this.statusCode = statusCode
    this.errors = formatErrorsArray(errors)
  }

  toJSON() {
    return {
      status: this.statusCode,
      message: this.message,
      errors: this.errors
    }
  }
}

module.exports = RegioError
