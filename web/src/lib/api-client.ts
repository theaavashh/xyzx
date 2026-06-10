'use client';

import axios, { AxiosError } from 'axios';
import { QueryClient } from '@tanstack/react-query';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export const apiClient = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ success: boolean; message: string }>) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const queryClient = new QueryClient({
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

export const api = {
  get: <T>(endpoint: string, params?: Record<string, unknown>) =>
    apiClient.get<T>(endpoint, { params }).then(res => res.data),

  post: <T>(endpoint: string, data?: unknown) =>
    apiClient.post<T>(endpoint, data).then(res => res.data),

  put: <T>(endpoint: string, data?: unknown) =>
    apiClient.put<T>(endpoint, data).then(res => res.data),

  patch: <T>(endpoint: string, data?: unknown) =>
    apiClient.patch<T>(endpoint, data).then(res => res.data),

  delete: <T>(endpoint: string) =>
    apiClient.delete<T>(endpoint).then(res => res.data),
};

export default apiClient;