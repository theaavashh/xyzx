import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SELF = "'self'";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const isProduction = process.env.NODE_ENV === 'production';
  const API_BASE = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || (isProduction ? '' : 'http://localhost:9999');

  const wsBase = API_BASE.replace(/^http/, 'ws');
  const connectSrc = [SELF, API_BASE, wsBase, 'https://*.stripe.com', 'https://*.google-analytics.com', 'https://*.cloudflareinsights.com']
    .filter(Boolean)
    .join(' ');

  const cspDirectives = [
    `default-src ${SELF}`,
    `script-src ${SELF} 'unsafe-inline' https://js.stripe.com https://static.cloudflareinsights.com`,
    `style-src ${SELF} 'unsafe-inline' fonts.googleapis.com`,
    `img-src ${SELF} data: https: http:`,
    `font-src ${SELF} fonts.gstatic.com data:`,
    `connect-src ${connectSrc}`,
    `frame-src ${SELF} https://*.stripe.com`,
    `object-src 'none'`,
    `base-uri ${SELF}`,
    `form-action ${SELF}`,
    `frame-ancestors 'none'`,
    ...(isProduction ? ['upgrade-insecure-requests'] : []),
  ].join('; ');

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Content-Security-Policy', cspDirectives);

  if (isProduction) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload',
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json|.*\\..*).*)',
  ],
};
