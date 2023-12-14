/* eslint-disable no-unused-vars */
import { NextResponse, NextRequest, userAgent } from 'next/server';
import nextSafe from 'next-safe';
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

/**
 * Middleware to set CSP headers
 *
 * @param {NextRequest} request
 */
// export default function cspHeaderMiddleware(request) {
function cspHeaderMiddleware(request, response) {
  // console.log('>>>>>>>>>');

  // response.headers.set(
  //   'Content-Security-Policy',
  //   contentSecurityPolicyHeaderValue,
  // );

  // console.log(response.headers);//
  return response;
}

const getRedirectUrl = (countryName, pathName) => {
  const isProhibited = true;
  // const isProhibited = prohibitedCountriesCode.includes(countryName);
  if (pathName === '/not-legal') {
    return isProhibited ? null : '/';
  }
  return isProhibited ? '/not-legal' : null;
};
/**
 * Middleware to validate the country
 *
 * @param {NextRequest} request
 */
const validateCountryMiddleware = async (request) => {
  const country = request.geo?.country;
  const redirectUrl = getRedirectUrl(country, request.nextUrl.pathname);

  const response = redirectUrl
    ? NextResponse.redirect(new URL(redirectUrl, request.nextUrl))
    : NextResponse.next();

  const browserName = userAgent(request)?.browser.name;
  const cspHeaders = getCspHeader(browserName);

  const contentSecurityPolicyHeaderValue = cspHeaders[0].value;
  // console.log(cspHeaders[0].key);

  // const requestHeaders = new NextRequest(request);
  const requestHeaders = new Headers(request.headers);
  // cspHeaders.forEach((header) => {
  //   const { key, value } = header;
  //   // requestHeaders.headers.set(key, value);
  //   requestHeaders.set(key, value);
  // });

  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue,
  );

  // response.headers.set('x-hello-from-middleware1', 'hello');

  cspHeaders.forEach((header) => {
    const { key, value } = header;
    console.log(key);
    response.headers.set(key, value);
  });

  return response;
};

/**
 * common middleware
 *
 * @param {NextRequest} request
 */
export default async function middleware(request) {
  return validateCountryMiddleware(request);
  // return cspHeaderMiddleware(request);
  // console.log(request.headers);
  // return NextResponse.next();
}
