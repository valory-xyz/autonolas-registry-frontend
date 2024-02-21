import { NextResponse, userAgent } from 'next/server';
import nextSafe from 'next-safe';
import prohibitedCountries from './data/prohibited-countries.json';

const prohibitedCountriesCode = Object.values(prohibitedCountries);

const isDev = process.env.NODE_ENV !== 'production';

const getCspHeader = (browserName) => {
  const walletconnectSrc = [
    'https://verify.walletconnect.org',
    'https://verify.walletconnect.com',
  ];

  // const RPC_URLS = [
  // process.env.NEXT_PUBLIC_MAINNET_URL,
  // process.env.NEXT_PUBLIC_GOERLI_URL,
  // process.env.NEXT_PUBLIC_GNOSIS_URL,
  // process.env.NEXT_PUBLIC_POLYGON_URL,
  // process.env.NEXT_PUBLIC_GNOSIS_CHIADO_URL,
  // process.env.NEXT_PUBLIC_POLYGON_MUMBAI_URL,
  // process.env.NEXT_PUBLIC_AUTONOLAS_URL,
  // process.env.NEXT_PUBLIC_ARBITRUM_URL,
  // process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_URL,
  // process.env.NEXT_PUBLIC_BASE_SEPOLIA_URL,
  // ];

  const connectSrc = [
    "'self'",
    ...walletconnectSrc,
    'https://*.olas.network/',
    'https://*.autonolas.tech/',
    'https://rpc.walletconnect.com/',
    'wss://relay.walletconnect.org/',
    'wss://relay.walletconnect.com/',
    'https://explorer-api.walletconnect.com/',
    'https://gno.getblock.io/',
    'https://polygon-mainnet.g.alchemy.com/v2/',
    'https://polygon-mumbai-bor.publicnode.com/',
    'https://rpc.chiado.gnosis.gateway.fm/',
    'https://safe-transaction-mainnet.safe.global/api/v1/',
    'https://safe-transaction-goerli.safe.global/api/',
    'https://safe-transaction-gnosis-chain.safe.global/api/',
    'https://safe-transaction-polygon.safe.global/api/',
    'https://vercel.live/',
    'https://api.devnet.solana.com/',
    'wss://api.devnet.solana.com/',
    'https://api.mainnet-beta.solana.com/',
    'wss://api.mainnet-beta.solana.com/',
    'https://holy-convincing-bird.solana-mainnet.quiknode.pro/',
    'wss://holy-convincing-bird.solana-mainnet.quiknode.pro/',
    'https://arb1.arbitrum.io/rpc/',
    'https://sepolia-rollup.arbitrum.io/rpc',
    'https://rpc.gnosischain.com/',
    'https://sepolia.base.org/',
    'https://sepolia.optimism.io/',
    // ...RPC_URLS,
  ];

  if (isDev) {
    connectSrc.push('http://localhost');
    connectSrc.push('ws://localhost');
  }

  const scriptSrc = ["'self'", 'https://vercel.live/', 'https://fonts.googleapis.com/'];

  // Firefox blocks inline scripts by default and it's an issue with Metamask
  // reference: https://github.com/MetaMask/metamask-extension/issues/3133
  if (browserName === 'Firefox') {
    scriptSrc.push("'unsafe-inline'");
  }

  const headers = [
    ...nextSafe({
      isDev,
      /**
       * Content Security Policy
       * @see https://content-security-policy.com/
       */
      contentSecurityPolicy: {
        'default-src': "'none'",
        'script-src': scriptSrc,
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
  ];

  return headers;
};

/**
 *
 * @param {string} countryName
 * @param {string} pathName
 * @returns {string} redirectUrl
 */
const getRedirectUrl = (countryName, pathName) => {
  const isProhibited = prohibitedCountriesCode.includes(countryName);

  if (pathName === '/not-legal') {
    return isProhibited ? null : '/';
  }
  return isProhibited ? '/not-legal' : null;
};

/**
 * common middleware
 *
 * @param {NextRequest} request
 */
export default async function middleware(request) {
  const country = request.geo?.country;
  const redirectUrl = getRedirectUrl(country, request.nextUrl.pathname);

  const response = redirectUrl
    ? NextResponse.redirect(new URL(redirectUrl, request.nextUrl))
    : NextResponse.next();

  const browserName = userAgent(request)?.browser.name;
  const cspHeaders = getCspHeader(browserName);

  // apply CSP headers
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#setting-headers
  cspHeaders.forEach((header) => {
    const { key, value } = header;
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
