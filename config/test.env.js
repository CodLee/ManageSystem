var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  API_URL: '"http://10.78.8.136"',
  API_PORT: '"8080"',
  API_ROOT_PATH: '"market"'
});
