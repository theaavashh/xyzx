import { csrfHeaders } from '@/utils/csrf';

export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly data?: Record<string, unknown>;

  constructor(status: number, statusText: string, message: string, data?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isRateLimited(): boolean {
    return this.status === 429;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}

const DEFAULT_TIMEOUT = 10_000;

export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = DEFAULT_TIMEOUT,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  timeout = DEFAULT_TIMEOUT,
): Promise<T> {
  // Use relative paths to leverage Next.js rewrites and avoid CORS issues
  const url = endpoint;

  const method = options.method?.toUpperCase() ?? 'GET';

  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string> | undefined),
      ...csrfHeaders(method),
    },
  };

  try {
    const response = await fetchWithTimeout(url, config, timeout);

    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      const errorData = isJson
        ? await response.json().catch(() => undefined)
        : undefined;

      const message = errorData?.message
        ? String(errorData.message)
        : `Request failed with status ${response.status} ${response.statusText}`;

      console.error(`API Error [${response.status}] ${url}:`, message);

      throw new ApiError(
        response.status,
        response.statusText,
        message,
        errorData as Record<string, unknown> | undefined,
      );
    }

    if (!isJson) {
      throw new ApiError(
        response.status,
        response.statusText,
        `Expected JSON response but received ${contentType || 'unknown content type'}`,
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error(`Fetch Error ${url}:`, error);
    throw error;
  }
}

export function getApiBaseUrl(): string {
  // Return empty string for client-side to use relative paths (proxy)
  if (typeof window !== 'undefined') return '';
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';
}

export const api = {
  get: <T>(url: string, options?: RequestInit) => apiRequest<T>(url, { method: 'GET', ...options }),
  post: <T>(url: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(url, { method: 'POST', body: JSON.stringify(data), ...options }),
  put: <T>(url: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(url, { method: 'PUT', body: JSON.stringify(data), ...options }),
  patch: <T>(url: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(url, { method: 'PATCH', body: JSON.stringify(data), ...options }),
  delete: <T>(url: string, options?: RequestInit) =>
    apiRequest<T>(url, { method: 'DELETE', ...options }),
};
