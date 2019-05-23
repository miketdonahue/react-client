const development = require('./development');
const production = require('./production');
const test = require('./test');

const env = process.env.NODE_ENV || 'development';
const config = {
  development,
  production,
  test,
};

module.exports = config[env];
