/* eslint-disable import/no-extraneous-dependencies */
const nextSafe = require('next-safe');
// const { nextSafe } = require('next-safe');

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
  /**
   * Headers for all routes
   * @see https://nextjs.org/docs/api-reference/next.config.js/headers
   */
  async headers() {
    const connectSrc = [
      "'self'",
      'https://*.autonolas.tech/',
      'https://verify.walletconnect.org/',
      'https://verify.walletconnect.com/',
      'https://rpc.walletconnect.com/',
      'wss://relay.walletconnect.org/',
      'wss://relay.walletconnect.com/',
      'https://explorer-api.walletconnect.com/',
      'https://eth-mainnet.g.alchemy.com/v2/',
      'https://eth-goerli.g.alchemy.com/v2/',
      'https://gno.getblock.io/',
      'https://polygon-mainnet.g.alchemy.com/v2/',
      'https://polygon-mumbai-bor.publicnode.com/',
      'https://rpc.chiado.gnosis.gateway.fm/',
      'https://safe-transaction-mainnet.safe.global/api/v1/',
      'https://safe-transaction-goerli.safe.global/api/',
      'https://safe-transaction-gnosis-chain.safe.global/api/',
      'https://safe-transaction-polygon.safe.global/api/',
      'https://vercel.live/',
    ];

    if (isDev) {
      connectSrc.push('http://localhost');
      connectSrc.push('ws://localhost');
    }

    return [
      {
        source: '/:path*',
        headers: [
          ...nextSafe({
            isDev,
            /**
             * Content Security Policy
             * @see https://content-security-policy.com/
             */
            contentSecurityPolicy: {
              'default-src': "'none'",
              'script-src': ["'self'", 'https://verify.walletconnect.com/', 'https://vercel.live/'],
              'connect-src': connectSrc,
              'img-src': [
                "'self'",
                'https://*.autonolas.tech/',
                'https://explorer-api.walletconnect.com/w3m/',
                'https://verify.walletconnect.org/',
                'https://verify.walletconnect.com/',
                'data:',
              ],
              'style-src': ["'self'", "'unsafe-inline'"],
              'child-src': ["'self'", 'https://verify.walletconnect.com/', 'https://verify.walletconnect.org/'],
              'base-uri': ["'self'", 'https://verify.walletconnect.com/', 'https://verify.walletconnect.org/'],
              'font-src': ["'self'", 'https://verify.walletconnect.com/', 'https://verify.walletconnect.org/'],
              'form-action': ["'self'", 'https://verify.walletconnect.com/', 'https://verify.walletconnect.org/'],
              'frame-ancestors': ["'self'", 'https://verify.walletconnect.com/', 'https://verify.walletconnect.org/'],
              'frame-src': ["'self'", 'https://verify.walletconnect.com/', 'https://verify.walletconnect.org/'],
              'manifest-src': ["'self'", 'https://verify.walletconnect.com/', 'https://verify.walletconnect.org/'],
              'media-src': ["'self'", 'https://verify.walletconnect.com/', 'https://verify.walletconnect.org/'],
              'object-src': ["'self'", 'https://verify.walletconnect.com/', 'https://verify.walletconnect.org/'],
              'prefetch-src': ["'self'", 'https://verify.walletconnect.com/', 'https://verify.walletconnect.org/'],
              'worker-src': ["'self'", 'https://verify.walletconnect.com/', 'https://verify.walletconnect.org/'],
            },
            permissionsPolicyDirectiveSupport: ['standard'],
          }),
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};
