const path = require('path')

const { getLoader, loaderByName } = require('@craco/craco')

const CracoLessPlugin = {
  plugin: require('craco-less'),
  options: {
    modifyLessRule: (lessRule, { paths }) => {
      lessRule.test = /\.less$/
      lessRule.include = [
        path.resolve(paths.appSrc, 'styles'),
        path.resolve(paths.appNodeModules, 'semantic-ui-less')
      ]
      return lessRule
    }
  }
}

module.exports = {
  webpack: {
    configure: (webpackConfig, { paths }) => {
      webpackConfig.resolve.alias['../../theme.config$'] = path.resolve(
        paths.appSrc,
        'styles/semantic/theme.config'
      )

      webpackConfig.resolve.modules = webpackConfig.resolve.modules
        .concat([paths.appNodeModules, paths.appSrc])
        .concat(process.env.NODE_PATH.split(path.delimiter).filter(Boolean))

      const { isFound, match: fileLoaderMatch } = getLoader(
        webpackConfig,
        loaderByName('file-loader')
      )

      if (isFound) {
        fileLoaderMatch.loader.exclude.push(
          RegExp(
            `${path.resolve(
              paths.appNodeModules,
              'semantic-ui-less'
            )}.+\\.(config|overrides|variables)$`
          ),
          RegExp(
            `${path.resolve(
              paths.appSrc,
              'styles',
              'semantic'
            )}.+\\.(config|overrides|variables)$`
          )
        )
      }

      return webpackConfig
    }
  },
  plugins: [CracoLessPlugin]
}
