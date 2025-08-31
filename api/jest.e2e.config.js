const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  displayName: 'E2E Tests',
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Test files patterns
  testMatch: [
    '<rootDir>/test/e2e/**/*.e2e-spec.ts',
  ],
  
  // Ignore unit tests
  testPathIgnorePatterns: [
    '<rootDir>/src/',
    '<rootDir>/test/unit/',
    '<rootDir>/node_modules/',
  ],
  
  // Module resolution
  moduleNameMapping: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/test/setup.ts',
    '<rootDir>/test/e2e/setup.e2e.ts',
  ],
  
  // Teardown
  globalTeardown: '<rootDir>/test/e2e/teardown.e2e.ts',
  
  // Transform configuration
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  
  // Test timeout (longer for e2e tests)
  testTimeout: 30000,
  
  // Run tests serially for database consistency
  maxWorkers: 1,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Don't collect coverage for e2e tests
  collectCoverage: false,
};