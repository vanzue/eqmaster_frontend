module.exports = {
    testTimeout: 20000,
    reporters: [
        'default'
    ],
    watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
    moduleFileExtensions: ['js', 'json'],
    rootDir: __dirname,
    testMatch: ["<rootDir>/src/**/*test.[jt]s?(x)"],
    testPathIgnorePatterns: ['/node_modules/']
}
