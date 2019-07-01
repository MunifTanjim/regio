const path = require('path')
const dotenv = require('dotenv')
const convict = require('convict')

/**
 * Load configuration
 */

dotenv.config({
  path: path.resolve('.env')
})

const config = convict({
  env: {
    doc: 'Environment',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  express: {
    cluster: {
      enable: {
        doc: 'Enable Cluster mode',
        format: Boolean,
        default: true,
        env: 'EXPRESS_CLUSTER_MODE'
      },
      instanceId: {
        doc: 'Instance ID in Cluster mode',
        format: 'nat',
        default: 0,
        env: 'EXPRESS_INSTANCE_ID'
      },
      instances: {
        doc: 'Number of instances for Cluster mode',
        format: value => {
          if (!Number.isInteger(value) && value !== 'max')
            throw TypeError('must be a Number or "max"')
        },
        default: 2,
        env: 'EXPRESS_CLUSTER_INSTANCES'
      }
    },
    killTimeout: {
      doc: 'Kill Timeout',
      format: 'nat',
      default: 2000,
      env: 'EXPRESS_KILL_TIMEOUT'
    }
  }
})

config.validate({ allowed: 'strict' })

/**
 * Start PM2 Ecosystem file
 */

const environment = config.get('env')

const expressApp = {
  name: 'regio-backend',
  script: 'server.js',
  instance_var: 'EXPRESS_INSTANCE_ID',
  kill_timeout: config.get('express.killTimeout'),
  env: {
    NODE_ENV: environment
  }
}

if (config.get('express.cluster.enable')) {
  expressApp.exec_mode = 'cluster'
  expressApp.instances = ['development'].includes(environment)
    ? 1
    : config.get('express.cluster.instances')
}

const pm2Config = {
  apps: [expressApp]
}

module.exports = pm2Config
