const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';
const CSRF_META_TAG_NAME = 'csrf-token';

export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function getCsrfToken(): string | null {
  const metaTag = document.querySelector<HTMLMetaElement>(
    `meta[name="${CSRF_META_TAG_NAME}"]`,
  );
  if (metaTag?.content) {
    return metaTag.content;
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CSRF_COOKIE_NAME}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function addCsrfToHeaders(headers: HeadersInit): HeadersInit {
  const token = getCsrfToken();
  if (!token) return headers;

  if (headers instanceof Headers) {
    headers.set(CSRF_HEADER_NAME, token);
    return headers;
  }

  return {
    ...headers,
    [CSRF_HEADER_NAME]: token,
  };
}

export function setCsrfToken(): string {
  const token = generateCsrfToken();
  document.cookie = `${CSRF_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=86400; sameSite=strict${location.protocol === 'https:' ? '; secure' : ''}`;
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${CSRF_META_TAG_NAME}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = CSRF_META_TAG_NAME;
    document.head.appendChild(meta);
  }
  meta.content = token;
  return token;
}

export function isMutationMethod(method?: string): boolean {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method?.toUpperCase() ?? '');
}
