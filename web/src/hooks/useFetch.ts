'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export function useFetchList<T>(
  endpoint: string,
  params?: PaginationParams,
  options?: { enabled?: boolean; queryKey?: string[] }
) {
  return useQuery<PaginatedResponse<T>>({
    queryKey: [endpoint, params, ...(options?.queryKey || [])],
    queryFn: () => api.get<PaginatedResponse<T>>(endpoint, { params }),
    enabled: options?.enabled ?? true,
  });
}

export function useFetchOne<T>(endpoint: string, id: string | number, options?: { enabled?: boolean }) {
  return useQuery<ApiResponse<T>>({
    queryKey: [endpoint, id],
    queryFn: () => api.get<ApiResponse<T>>(`${endpoint}/${id}`),
    enabled: options?.enabled ?? !!id,
  });
}

export function useCreate<TData, TVariables>(
  endpoint: string,
  options?: { invalidates?: string[][] }
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<TData>, Error, TVariables>({
    mutationFn: (variables) => api.post<ApiResponse<TData>>(endpoint, variables),
    onSuccess: () => {
      if (options?.invalidates) {
        options.invalidates.forEach((keys) => {
          queryClient.invalidateQueries({ queryKey: keys });
        });
      }
    },
  });
}

export function useUpdate<TData, TVariables>(
  endpoint: string,
  options?: { invalidates?: string[][] }
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<TData>, Error, TVariables>({
    mutationFn: (variables) => api.patch<ApiResponse<TData>>(endpoint, variables),
    onSuccess: () => {
      if (options?.invalidates) {
        options.invalidates.forEach((keys) => {
          queryClient.invalidateQueries({ queryKey: keys });
        });
      }
    },
  });
}

export function useDelete<TData = void>(
  endpoint: string,
  options?: { invalidates?: string[][] }
) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<TData>, Error, string | number>({
    mutationFn: (id) => api.delete<ApiResponse<TData>>(`${endpoint}/${id}`),
    onSuccess: () => {
      if (options?.invalidates) {
        options.invalidates.forEach((keys) => {
          queryClient.invalidateQueries({ queryKey: keys });
        });
      }
    },
  });
}