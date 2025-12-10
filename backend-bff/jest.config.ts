import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTest.ts'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  clearMocks: true,
  testTimeout: 20000,
};

export default config;
