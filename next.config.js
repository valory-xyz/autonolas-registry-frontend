// eslint-disable-next-line import/no-extraneous-dependencies
const withBundleAnalyzer = require('@next/bundle-analyzer');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  pages: {
    '*': {
      maxChunkSize: 30000,
    },
  },
  redirects: async () => [
    {
      source: '/components',
      destination: '/mainnet/components',
      permanent: true,
    },
    {
      source: '/agents',
      destination: '/mainnet/agents',
      permanent: true,
    },
    {
      source: '/services',
      destination: '/mainnet/services',
      permanent: true,
    },
  ],
};

module.exports = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
}, nextConfig);
