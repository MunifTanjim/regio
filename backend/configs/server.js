require('./env.js')

const convict = require('convict')

const config = convict({
  env: {
    doc: 'Environment',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'Application Port',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  cookie: {
    domain: {
      doc: 'Cookie Domain',
      format: String,
      default: '',
      env: 'COOKIE_DOMAIN'
    },
    maxAge: {
      doc: 'Cookie Max-Age',
      format: Number,
      default: 12 * 60 * 60 * 1000, // 12 hours
      env: 'COOKIE_MAXAGE'
    }
  },
  database: {
    connectionUri: {
      doc: 'Database Connection URI',
      format: String,
      default: 'postgresql://postgres:postgres@database:5432/regio',
      env: 'DATABASE_CONNECTION_URI'
    },
    host: {
      doc: 'Database Host',
      format: 'ipaddress',
      default: '127.0.0.1',
      env: 'DB_HOST'
    },
    port: {
      doc: 'Database Port',
      format: 'port',
      default: 5432,
      env: 'DB_PORT'
    },
    name: {
      doc: 'Database Name',
      format: String,
      default: 'regiodb',
      env: 'DB_NAME'
    },
    user: {
      doc: 'Database User',
      format: String,
      default: 'postgres',
      env: 'DB_USER'
    },
    password: {
      doc: 'Database Password',
      format: String,
      default: 'postgres',
      env: 'DB_PASSWORD'
    }
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

module.exports = config
