const asyncHandler = require('express-async-handler')

const handler = asyncHandler(async (req, res, next) => {
  req.session = null

  res.status(204).json({
    data: null
  })
})

module.exports.handler = [].concat(handler)
