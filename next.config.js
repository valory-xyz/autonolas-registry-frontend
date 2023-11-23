/* eslint-disable import/no-extraneous-dependencies */
const nextSafe = require('next-safe');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
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
      source: '/',
      destination: '/ethereum/components',
      permanent: true,
    },
    {
      source: '/components',
      destination: '/ethereum/components',
      permanent: true,
    },
    {
      source: '/agents',
      destination: '/ethereum/agents',
      permanent: true,
    },
    {
      source: '/services',
      destination: '/ethereum/services',
      permanent: true,
    },
  ],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          ...nextSafe({ isDev }),
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};
