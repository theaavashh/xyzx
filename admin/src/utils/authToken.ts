const TOKEN_KEY = 'admin_access_token';

/**
 * Store the access token received from login/OTP response.
 * The server sets accessToken as httpOnly cookie, but since admin
 * runs cross-origin, we can't read it via document.cookie.
 * Instead we store it in localStorage and send as Bearer header.
 * The CSRF middleware skips CSRF validation when Bearer auth is present.
 */
export function setAccessToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // localStorage unavailable (SSR) — ignore
  }
}

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function clearAccessToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}
