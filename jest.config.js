const baseConfig = require('./jest.config.base')

module.exports = {
  ...baseConfig,
  projects: ['<rootDir>/packages/server', '<rootDir>/packages/client'],
}
