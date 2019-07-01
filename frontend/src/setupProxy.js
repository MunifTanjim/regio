const proxy = require('http-proxy-middleware')

const apiUrl = process.env.REACT_APP_API_URL

module.exports = app => {
  app.use(
    '/api/**',
    proxy({
      target: apiUrl,
      pathRewrite: path => path.replace(/^\/api/, '')
    })
  )
}
