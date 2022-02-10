const withAntdLess = require('next-plugin-antd-less');

module.exports = {
  ...withAntdLess({
    // lessVarsFilePath: './styles/antd.less',
    lessVarsFilePathAppendToEndOfContent: false,
    cssLoaderOptions: {
      importLoaders: 1,
    },
    lessLoaderOptions: {
      javascriptEnabled: true,
    },
    productionBrowserSourceMaps: true,
    webpack(config) {
      return config;
    },
  }),
  publicRuntimeConfig: {
    INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID,
    INFURA_PROJECT_SECRET: process.env.INFURA_PROJECT_ID,
    INFURA_TO_PUBLIC_ADDRESS: process.env.INFURA_TO_PUBLIC_ADDRESS,
    TEST_NETWORK: process.env.TEST_NETWORK,
  },
};
