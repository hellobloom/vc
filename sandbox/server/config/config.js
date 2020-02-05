require('babel-register')

module.exports = {
  development: {
    username: undefined,
    password: undefined,
    host: 'localhost',
    database: 'vc-sandbox-dev',
    dialect: 'postgres',
  },
  test: {
    username: undefined,
    password: undefined,
    host: 'localhost',
    database: 'vc-sandbox-test',
    dialect: 'postgres',
  },
  production: {
    username: undefined,
    password: undefined,
    host: 'localhost',
    database: 'vc-sandbox-prod',
    dialect: 'postgres',
  },
}
