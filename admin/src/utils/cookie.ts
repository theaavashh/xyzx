export function setCookie(name: string, value: string, maxAgeSeconds: number, path = '/') {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=${path}; SameSite=Strict${secure}`;
}
