/* eslint-disable no-param-reassign */
const withAntdLess = require('next-plugin-antd-less');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const path = require('path');

module.exports = withBundleAnalyzer(
  {
    enabled: process.env.ANALYZE === 'true',
    ...withAntdLess({
      reactStrictMode: true,
      lessVarsFilePath: './styles/variables.less',
      lessVarsFilePathAppendToEndOfContent: false,
      cssLoaderOptions: {},
      lessLoaderOptions: {
        javascriptEnabled: true,
      },
      webpack(config) {
        config.resolve.alias.react = path.resolve('./node_modules/react');
        config.resolve.alias['react-dom'] = path.resolve('./node_modules/react-dom');
        config.resolve.alias.antd = path.resolve('./node_modules/antd');
        config.resolve.alias['styled-components'] = path.resolve('./node_modules/styled-components');

        return config;
      },
    }),
    compiler: {
      styledComponents: true,
    },
  },
);
