import axios, { 
  AxiosInstance, 
  AxiosError, 
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosResponse 
} from 'axios';
import { QueryClient } from '@tanstack/react-query';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ field?: string; message: string; code?: string }>;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  errors?: Array<{ field?: string; message: string }>;
}

export interface TokenRefreshResponse {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
}

class TokenRefreshManager {
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: void) => void;
    reject: (reason: unknown) => void;
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

  async refreshToken(baseURL: string): Promise<void> {
    try {
      const response = await axios.post<TokenRefreshResponse>(
        `${baseURL}/api/v1/auth/refresh`,
        {},
        { withCredentials: true }
      );

      if (response.status !== 200 || !response.data.success) {
        throw new Error('Token refresh failed');
      }
    } catch {
      this.handleAuthFailure();
      throw new Error('Token refresh failed');
    }
  }

  private handleAuthFailure(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:401'));
    }
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
}

export interface ApiClientConfig {
  baseURL: string;
  retryLimit?: number;
  timeout?: number;
}

export const createApiClient = (config: ApiClientConfig): AxiosInstance => {
  const { baseURL, retryLimit = 0, timeout = 30000 } = config;

  const tokenRefreshManager = new TokenRefreshManager();

  const api = axios.create({
    baseURL,
    withCredentials: true,
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use(
    (internalConfig: InternalAxiosRequestConfig) => {
      const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
        internalConfig.method?.toUpperCase() || ''
      );
      
      if (isMutation) {
        const csrfToken = getCsrfToken();
        if (csrfToken) {
          internalConfig.headers['X-CSRF-Token'] = csrfToken;
        }
      }

      const requestId = generateRequestId();
      internalConfig.headers['X-Request-ID'] = requestId;

      return internalConfig;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ApiResponse>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (!originalRequest) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        const isRefreshRequest = originalRequest.url?.includes('/auth/refresh');
        if (isRefreshRequest) {
          return Promise.reject(error);
        }

        if (tokenRefreshManager.isCurrentlyRefreshing()) {
          try {
            await tokenRefreshManager.enqueueRequest();
            return api(originalRequest);
          } catch {
            return Promise.reject(error);
          }
        }

        originalRequest._retry = true;
        tokenRefreshManager.setRefreshing(true);

        try {
          await tokenRefreshManager.refreshToken(baseURL);
          tokenRefreshManager.processQueue(null);
          return api(originalRequest);
        } catch (refreshError) {
          tokenRefreshManager.processQueue(
            refreshError instanceof Error ? refreshError : new Error('Unknown error')
          );
          return Promise.reject(error);
        } finally {
          tokenRefreshManager.setRefreshing(false);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

const getCsrfToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrf-token') {
      return decodeURIComponent(value);
    }
  }
  return null;
};

const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

export const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
      },
      mutations: {
        retry: 0,
      },
    },
  });
};

export const extractApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;
    
    if (axiosError.response) {
      return {
        status: axiosError.response.status,
        message: axiosError.response.data?.message || 'An error occurred',
        code: axiosError.response.data?.errors?.[0]?.code,
        errors: axiosError.response.data?.errors,
      };
    }

    if (axiosError.request) {
      return {
        status: 0,
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      };
    }
  }

  if (error instanceof Error) {
    return {
      status: 500,
      message: error.message,
      code: 'UNKNOWN_ERROR',
    };
  }

  return {
    status: 500,
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public errors?: Array<{ field?: string; message: string }>
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export const isAuthError = (error: unknown): boolean => {
  const apiError = extractApiError(error);
  return apiError.status === 401 || apiError.message.toLowerCase().includes('unauthorized');
};

export const handleApiError = (error: unknown): string => {
  const apiError = extractApiError(error);
  return apiError.message;
};