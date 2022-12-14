/*
 * © 2021 Thoughtworks, Inc.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('../../jest.base.config')

module.exports = {
  ...baseConfig,
  coverageThreshold: {
    global: {
      statements: 78,
      branches: 73,
      functions: 80,
      lines: 78,
    },
  },
  testPathIgnorePatterns: ['<rootDir>/src/__tests__/fixtures'],
  modulePathIgnorePatterns: ['index.ts'],
}
