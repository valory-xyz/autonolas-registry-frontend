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
    const walletconnectSrc = [
      'https://verify.walletconnect.org',
      'https://verify.walletconnect.com',
    ];
    const connectSrc = [
      "'self'",
      ...walletconnectSrc,
      'https://*.olas.network/',
      'https://*.autonolas.tech/',
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
              'script-src': ["'self'", "'unsafe-inline'"],
              'connect-src': connectSrc,
              'img-src': [
                "'self'",
                'data:',
                'https://*.autonolas.tech/',
                'https://explorer-api.walletconnect.com/w3m/',
                ...walletconnectSrc,
              ],
              'style-src': ["'self'", "'unsafe-inline'"],
              'frame-src': ["'self'", ...walletconnectSrc],
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
