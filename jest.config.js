/* eslint-disable @typescript-eslint/no-var-requires */
const { defaults } = require('jest-config');
const config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 84,
      statements: -26,
    },
  },
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.entity.ts',
    '!**/*.dto.ts',
    '!**/*.module.ts',
    '!**/*.enum.ts',
    '!**/*.decorator.ts',
    '!**/*.guard.ts',
    '!main.ts',
  ]
};

module.exports = config;
