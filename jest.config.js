module.exports = {
  verbose: true,
  collectCoverageFrom: [
    'components/Login/*.{js,jsx}',
    '!components/Login/**/styles.{js,jsx}',
  ],
  setupFilesAfterEnv: ['./jest.setup.js'],
};
