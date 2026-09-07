const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';

function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CSRF_COOKIE_NAME}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function authHeaders(
  extra?: Record<string, string>,
): Record<string, string> {
  const token =
    typeof document !== 'undefined'
      ? document.cookie
          .split(';')
          .find((c) => c.trim().startsWith('accessToken='))
          ?.split('=')[1]
      : undefined;
  const csrfToken = getCsrfToken();
  return {
    ...(token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {}),
    ...(csrfToken ? { [CSRF_HEADER_NAME]: csrfToken } : {}),
    ...extra,
  };
}

export function serverAuthHeaders(
  cookieHeader: string,
  extra?: Record<string, string>,
): Record<string, string> {
  const token = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('accessToken='))
    ?.split('=')[1];
  const csrfToken = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${CSRF_COOKIE_NAME}=`))
    ?.split('=')[1];
  return {
    cookie: cookieHeader,
    ...(token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {}),
    ...(csrfToken ? { [CSRF_HEADER_NAME]: decodeURIComponent(csrfToken) } : {}),
    ...extra,
  };
}