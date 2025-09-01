// Default Jest configuration - runs both unit and e2e tests
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  displayName: 'All Tests',
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Test files patterns
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/test/**/*.spec.ts',
    '<rootDir>/test/**/*.e2e-spec.ts',
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
  ],
  coverageDirectory: 'coverage/all',
  coverageReporters: ['text-summary', 'lcov', 'html'],
  
  // Module resolution
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/',
  }),
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  
  // Transform configuration
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  
  // Test timeout
  testTimeout: 30000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
};