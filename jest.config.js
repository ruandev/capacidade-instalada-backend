/* eslint-disable @typescript-eslint/no-var-requires */
const { defaults } = require('jest-config');
const config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 70,
      lines: 90,
      statements: -25,
    },
  },
};

module.exports = config;
