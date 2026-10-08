/** Kept stable so tokens stored by earlier builds keep working. */
const STORAGE_KEY = 'admin_access_token';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || '';

function buildCookieOptions(maxAgeSeconds: number): string {
  const isProduction = window.location.protocol === 'https:';
  const sameSite = isProduction ? 'none' : 'lax';
  const domainPart = COOKIE_DOMAIN ? `; domain=${COOKIE_DOMAIN}` : '';
  return `path=/; max-age=${maxAgeSeconds}; sameSite=${sameSite}${isProduction ? '; secure' : ''}${domainPart}`;
}

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/**
 * Access token is stored in localStorage so the admin session survives
 * page reloads and browser restarts until the admin signs out.
 * It is also mirrored into a cookie as a fallback for storage-restricted
 * browsers. The httpOnly cookies on the API origin are refreshed by
 * `POST /api/v1/auth/refresh`; this value is only used to build the
 * `Authorization: Bearer` header (which is what bypasses CSRF).
 */
export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, token);
  } catch {
    // Storage unavailable (private mode) - the cookie copy still works.
  }
  document.cookie = `accessToken=${token}; ${buildCookieOptions(COOKIE_MAX_AGE_SECONDS)}`;
}

export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) return stored;
    } catch {
      // Fall through to the cookie copy.
    }
  }
  return getCookie('accessToken');
}

export function clearAccessToken(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
  const opts = COOKIE_DOMAIN ? 'path=/; domain=' + COOKIE_DOMAIN : 'path=/';
  document.cookie = `accessToken=; ${opts}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
