const config = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/lib/',
    '/src/__tests__/test-utils.js',
  ],
};

module.exports = config;
