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
  /**
   * Headers for all routes
   * @see https://nextjs.org/docs/api-reference/next.config.js/headers
   */
  async headers() {
    const connectSrc = [
      "'self'",
      'https://*.autonolas.tech/',
      'https://verify.walletconnect.org/',
      'wss://relay.walletconnect.org/',
      'https://rpc.walletconnect.com/',
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
      'wss://relay.walletconnect.com/',
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
              'script-src': "'self'",
              'connect-src': connectSrc,
              'img-src': [
                "'self'",
                'https://*.autonolas.tech/',
                'https://explorer-api.walletconnect.com/w3m/',
                'data:',
              ],
              'style-src': ["'self'"],
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
