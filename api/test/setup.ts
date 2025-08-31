// Jest setup file for common test configuration
// This file is automatically loaded before each test suite

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

// Set test environment variables
process.env.DATABASE_URL = 'file::memory:?cache=shared';
process.env.WEB_ORIGIN = 'http://localhost:3000';
process.env.JWT_SECRET = 'test-jwt-secret-32-chars-minimum-length';
process.env.LOG_LEVEL = 'silent';
process.env.LOG_PRETTY = 'false';

// Set test timeout
jest.setTimeout(30000);

// Mock console methods to keep test output clean during tests
if (process.env.NODE_ENV === 'test' && !process.env.JEST_VERBOSE) {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    // Keep error and trace for debugging
    error: console.error,
    trace: console.trace,
  };
}

// Extend Jest matchers if needed
// import 'jest-extended';