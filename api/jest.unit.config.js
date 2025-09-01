const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  displayName: 'Unit Tests',
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Test files patterns
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/test/unit/**/*.spec.ts',
  ],
  
  // Ignore e2e tests
  testPathIgnorePatterns: [
    '<rootDir>/test/e2e/',
    '<rootDir>/node_modules/',
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
  ],
  coverageDirectory: 'coverage/unit',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
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
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
};