export default {
    testEnvironment: 'node',
    verbose: true,
    coverageDirectory: 'coverage',
    testMatch: ['**/tests/**/*.test.js'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
};
