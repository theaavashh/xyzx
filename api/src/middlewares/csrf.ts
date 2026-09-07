import type { NextFunction, Request, Response } from 'express';

const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const CSRF_EXEMPT_PATHS = [
  '/auth/login',
  '/auth/login-with-totp',
  '/auth/signup',
  '/auth/refresh',
  '/auth/logout',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-otp',
  '/auth/resend-otp',
  '/auth/verify-credentials',
  '/public/',
];

/**
 * Double-submit CSRF protection for cookie-authenticated mutating requests.
 *
 * The storefront web app authenticates via the httpOnly `accessToken` cookie,
 * so a cross-site form/CSRF attack would carry that cookie automatically. To
 * stop this, each mutating request from an authenticated session must echo the
 * `csrf-token` cookie value in the `X-CSRF-Token` header (a value a
 * cross-origin attacker cannot read).
 *
 * Requests are skipped when:
 *  - the method is not mutating (GET/HEAD/OPTIONS),
 *  - the path is an auth or public route that doesn't need CSRF protection,
 *  - a `Authorization: Bearer` header is present (admin app - the attacker
 *    cannot forge a bearer header, so those requests are CSRF-immune), or
 *  - there is no `accessToken` session cookie (anonymous flows such as the
 *    guest cart and the public contact form have nothing to protect).
 */
export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response => {
  if (!MUTATING_METHODS.has(req.method.toUpperCase())) {
    return next();
  }

  const path = req.path;
  if (CSRF_EXEMPT_PATHS.some((exempt) => path.includes(exempt))) {
    return next();
  }

  const authHeader = req.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return next();
  }

  const cookies = req.cookies as Record<string, string> | undefined;
  if (!cookies?.accessToken) {
    return next();
  }

  const cookieToken = cookies[CSRF_COOKIE_NAME];
  const headerToken = req.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      success: false,
      message: 'CSRF token validation failed',
    });
  }

  return next();
};