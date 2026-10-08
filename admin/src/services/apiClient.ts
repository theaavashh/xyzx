import * as Sentry from '@sentry/nextjs';
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { queryClient } from '@/lib/queryClient';
import { isMutationMethod, getCsrfToken } from '@/utils/csrf';
import { getAccessToken, setAccessToken } from '@/utils/authToken';
import { getErrorMessage } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:9999';

class TokenRefreshManager {
  private isRefreshing = false;
  private refreshFailed = false;
  private inFlight: Promise<string | null> | null = null;
  private generation = 0;
  private failedQueue: Array<{
    resolve: (value: void) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  processQueue(error: Error | null): void {
    this.failedQueue.forEach((item) => {
      if (error) {
        item.reject(error);
      } else {
        item.resolve();
      }
    });
    this.failedQueue = [];
  }

  /**
   * Exchanges the httpOnly refresh cookie for a new access token.
   * The request must send cookies (`withCredentials`) because the refresh
   * token lives on the API origin; the access token is only used as an
   * optimisation, never required - an expired one must not block renewal.
   *
   * Failures are only latched as fatal when the server rejects the refresh
   * token itself (401/403). Transient network errors leave the session intact
   * so it can be retried on the next request.
   */
  async refreshToken(options: { latchFailure?: boolean } = {}): Promise<string | null> {
    if (this.inFlight) {
      return this.inFlight;
    }

    const run = async (): Promise<string | null> => {
      const latchFailure = options.latchFailure !== false;
      const generation = this.generation;
      if (this.refreshFailed) {
        throw new Error('Token refresh already failed');
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          },
        );

        const newAccessToken = response.data?.data?.accessToken;
        if (response.data?.success === false || !newAccessToken) {
          throw new Error('Token refresh returned no access token');
        }
        // `reset()` is called on sign-out; never resurrect a session that
        // was deliberately ended while this request was in flight.
        if (generation === this.generation) {
          setAccessToken(newAccessToken);
        }
        return newAccessToken;
      } catch (error) {
        const status = axios.isAxiosError(error) ? error.response?.status : undefined;
        const isAuthFailure = status === 401 || status === 403;

        if (isAuthFailure && latchFailure && generation === this.generation) {
          this.refreshFailed = true;
          queryClient.setQueryData(['profile'], null);
        }

        throw new Error('Token refresh failed');
      }
    };

    this.inFlight = run().finally(() => {
      this.inFlight = null;
    });

    return this.inFlight;
  }

  async enqueueRequest(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.failedQueue.push({ resolve, reject });
    });
  }

  isCurrentlyRefreshing(): boolean {
    return this.isRefreshing;
  }

  setRefreshing(value: boolean): void {
    this.isRefreshing = value;
  }

  hasFailed(): boolean {
    return this.refreshFailed;
  }

  reset(): void {
    this.isRefreshing = false;
    this.refreshFailed = false;
    this.failedQueue = [];
    this.generation += 1;
  }
}

const tokenRefreshManager = new TokenRefreshManager();

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isRefreshRequest = originalRequest.url?.includes('/auth/refresh');
    const isLogoutRequest = originalRequest.url?.includes('/auth/logout');
    const isLoginRequest = originalRequest.url?.includes('/auth/login');

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest && !isLogoutRequest && !isLoginRequest) {
      if (tokenRefreshManager.hasFailed()) {
        return Promise.reject(error);
      }

      if (tokenRefreshManager.isCurrentlyRefreshing()) {
        try {
          await tokenRefreshManager.enqueueRequest();
          return api(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      tokenRefreshManager.setRefreshing(true);

      try {
        await tokenRefreshManager.refreshToken();
        tokenRefreshManager.processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        tokenRefreshManager.processQueue(
          refreshError instanceof Error ? refreshError : new Error('Unknown error'),
        );
        // Only end the session when the refresh token itself was rejected.
        // A network blip must not sign the admin out.
        if (tokenRefreshManager.hasFailed() && typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:401'));
        }
        return Promise.reject(error);
      } finally {
        tokenRefreshManager.setRefreshing(false);
      }
    }

    if (error.response?.status && error.response.status >= 400 && error.response.data) {
      const data = error.response.data as Record<string, unknown>;
      const serverMessage = data.message;
      const serverErrors = data.errors;

      let extractedMessage = typeof serverMessage === 'string' ? serverMessage : '';

      if (Array.isArray(serverErrors) && serverErrors.length > 0) {
        const fieldMessages = serverErrors
          .map((e: { field?: string; message?: string }) => e.message || e)
          .join(', ');
        extractedMessage = extractedMessage ? `${extractedMessage}: ${fieldMessages}` : fieldMessages;
      }

      if (extractedMessage) {
        const enhancedError = new Error(extractedMessage);
        (enhancedError as any).status = error.response.status;
        (enhancedError as any).response = error.response;
        return Promise.reject(enhancedError);
      }
    }

    return Promise.reject(error);
  },
);

export async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  data?: unknown,
  config?: { params?: Record<string, unknown> },
): Promise<T> {
  try {
    const response = await api.request({
      url: endpoint,
      method: method.toLowerCase(),
      data: method !== 'GET' ? data : undefined,
      params: config?.params,
    });

    return response.data as T;
  } catch (error) {
    const message = getErrorMessage(error);
    if (message.includes('fetch failed') || message.includes('Network Error')) {
      throw new Error('Failed to connect to server');
    }
    if (error instanceof AxiosError && error.response) {
      Sentry.captureException(error, {
        tags: { endpoint, method },
        extra: { status: error.response.status, data: error.response.data },
      });
      const serverMessage = error.response.data?.message;
      if (serverMessage) {
        const errors = error.response.data?.errors;
        if (errors && Array.isArray(errors) && errors.length > 0) {
          const fieldMessages = errors.map((e: { field?: string; message?: string }) => e.message || e).join(', ');
          throw new Error(fieldMessages);
        }
        throw new Error(serverMessage);
      }
    }
    throw error;
  }
}

export async function uploadFile<T>(endpoint: string, file: File, fieldName = 'file'): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);

  const response = await api.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data as T;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    accessToken?: string;
    refreshToken?: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: unknown;
}

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/v1/auth/login', 'POST', { email, password, role: 'admin' });
}

export async function verifyOtpRequest(email: string, otp: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/v1/auth/verify-otp', 'POST', { email, otp });
}

export async function resendOtpRequest(email: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/v1/auth/resend-otp', 'POST', { email });
}

export async function forgotPasswordRequest(email: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/v1/auth/forgot-password', 'POST', { email });
}

export async function fetchProfile(): Promise<ProfileResponse | null> {
  return apiRequest<ProfileResponse>('/api/v1/auth/profile');
}

export async function logoutRequest(): Promise<void> {
  return apiRequest<void>('/api/v1/auth/logout', 'POST');
}

export { api, tokenRefreshManager };

export const apiWrapper = {
  get: <T>(endpoint: string, config?: { params?: Record<string, any> }) => apiRequest<T>(endpoint, 'GET', undefined, config),
  post: <T>(endpoint: string, data?: unknown) => apiRequest<T>(endpoint, 'POST', data),
  put: <T>(endpoint: string, data?: unknown) => apiRequest<T>(endpoint, 'PUT', data),
  patch: <T>(endpoint: string, data?: unknown) => apiRequest<T>(endpoint, 'PATCH', data),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, 'DELETE'),
};

export default api;
