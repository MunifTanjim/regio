const paths = {
  default: '/',
  v1: '/v1'
}

const handlers = {
  default: require('./v1'),
  v1: require('./v1')
}

const injectRoutes = app => {
  Object.keys(paths).forEach(tag => {
    app.use(paths[tag], handlers[tag])
  })
}

module.exports.injectRoutes = injectRoutes
