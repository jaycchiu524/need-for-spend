/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // ! ts-jest is not compatible with yarn 2 PnP
  // preset: 'ts-jest
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
  ],
  transformIgnorePatterns: [
    "/node_modules/",
    "\\.pnp\\.[^\\/]+$"
  ],
  transform: {
    // ! ts-jest is not compatible with yarn 2 PnP
    // ! Resolve ts-jest from the root of the project
    '^.+\\.tsx?$': require.resolve('ts-jest'),
  }
  // coverageDirectory: '<rootDir>/coverage',
  // verbose: true,
}
