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

  if (prohibitedCountriesCode.includes(country)) {
    return NextResponse.error('Blocked for legal reasons', { status: 451 });
  }

  return NextResponse.next();
}
