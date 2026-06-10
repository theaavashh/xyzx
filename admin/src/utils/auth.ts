let isRedirecting = false;

export function triggerAuthExpiredRedirect(redirectFn: (path: string) => void) {
  if (isRedirecting) return;
  isRedirecting = true;
  redirectFn('/');
}

export function isAuthError(message: string, status?: number): boolean {
  return (
    status === 401 ||
    message.includes('Access token is required') ||
    message.includes('Token has expired') ||
    message.includes('Invalid token') ||
    message.includes('Authentication error')
  );
}
