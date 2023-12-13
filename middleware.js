import { NextResponse, userAgent } from 'next/server';
import nextSafe from 'next-safe';
import { isArray } from 'lodash';
import prohibitedCountries from './data/prohibited-countries.json';

const prohibitedCountriesCode = Object.values(prohibitedCountries);

const isDev = process.env.NODE_ENV !== 'production';

const getCspHeader = (browserName) => {
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

  const scriptSrc = ["'self'", 'https://vercel.live/'];

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

const getRequestAndResponseAfterApplyingCsp = (req) => {
  const browserName = userAgent(req)?.browser.name;

  // const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeaders = getCspHeader(browserName);
  // const cspHeader = `
  //   default-src 'self';
  //   script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
  //   style-src 'self' 'nonce-${nonce}';
  //   img-src 'self' blob: data:;
  //   font-src 'self';
  //   object-src 'none';
  //   base-uri 'self';
  //   form-action 'self';
  //   frame-ancestors 'none';
  //   block-all-mixed-content;
  //   upgrade-insecure-requests;
  // `;
  // Replace newline characters and spaces
  // const contentSecurityPolicyHeaderValue = cspHeader
  //   .replace(/\s{2,}/g, ' ')
  //   .trim();

  const requestHeaders = new Headers(req.headers);
  // console.log(requestHeaders.set, '--->>>');
  cspHeaders.forEach((header) => {
    const { key, value } = header;
    // console.log(typeof key, key);
    // console.log(key, value);
    requestHeaders.set(key, value);
    // requestHeaders.set('Random', 'mohan');
  });

  console.log(requestHeaders);

  // requestHeaders.set(
  //   'Content-Security-Policy',
  //   contentSecurityPolicyHeaderValue,
  // );

  const response = NextResponse;
  cspHeaders.forEach((header) => {
    const { key, value } = header;
    // response.headers.set(key, value);
  });
  // response.headers.set(
  //   'Content-Security-Policy',
  //   contentSecurityPolicyHeaderValue,
  // );

  return { request: req, response };
};

/**
 * Middleware to validate the country
 *
 * @param {NextRequest} request
 */
export default function validateCountryMiddleware(rawRequest) {
  const { request, response } = getRequestAndResponseAfterApplyingCsp(rawRequest);

  // console.log(request);

  const country = request.geo?.country;
  const isProhibited = prohibitedCountriesCode.includes(country);

  // console.log(request);
  // console.log(getCspHeader(browserName));

  // if already on the not-legal page, don't redirect
  if (request.nextUrl.pathname === '/not-legal') {
    if (isProhibited) {
      return response.next();
    }

    // if not prohibited & trying to access not-legal page, redirect to home
    return response.redirect(new URL('/', request.url));
  }

  // if country is prohibited, redirect to not-legal page
  if (isProhibited) {
    return response.redirect(new URL('/not-legal', request.url));
  }

  return response.next();
}
