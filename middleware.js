import { NextResponse } from 'next/server';
import prohibitedCountries from './data/prohibited-countries.json';

const prohibitedCountriesCode = Object.values(prohibitedCountries);

/**
 * Middleware to validate the country
 *
 * @param {NextRequest} request
 */
export default function validateCountryMiddleware(request) {
  const country = request.geo?.country;
  const isProhibited = prohibitedCountriesCode.includes(country);

  // if already on the not-legal page, don't redirect
  if (request.nextUrl.pathname === '/not-legal') {
    if (isProhibited) {
      return NextResponse.next();
    }

    // if not prohibited & trying to access not-legal page, redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }

  // if country is prohibited, redirect to not-legal page
  if (isProhibited) {
    return NextResponse.redirect(new URL('/not-legal', request.url));
  }

  return NextResponse.next();
}
