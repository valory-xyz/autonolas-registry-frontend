module.exports = {
  verbose: true,
  collectCoverageFrom: [
    'common-util/**/*.{js,jsx}',
    'components/**/*.{js,jsx}',

    // ABI will change frequently on backend deployment hence avoiding.
    '!common-util/AbiAndAddresses/*.{js,jsx}',

    // Contract objects
    '!common-util/Contracts/*.{js,jsx}',

    // styles are not required to be tested
    '!common-util/**/styles.{js,jsx}',
    '!components/**/styles.{js,jsx}',
    '!components/GlobalStyles/*.{js,jsx}',

    // Infura testing
    '!components/ListTest/*.{js,jsx}',

    // Index page
    '!components/index/.jsx',
  ],
  setupFilesAfterEnv: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|my-project|react-native-button)/)',
  ],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  testEnvironment: 'jsdom',
};
