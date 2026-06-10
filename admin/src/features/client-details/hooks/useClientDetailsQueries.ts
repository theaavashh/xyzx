'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiRequest } from '@/services/apiClient';
import { clientLogger } from '@/lib/logger';
import type { ClientsResponse, UseClientsQueryParams } from '../types';

const CLIENTS_KEY = ['clients'];

export function useClientsQuery(params: UseClientsQueryParams) {
  const { page, limit, searchQuery, statusFilter, sortBy = 'createdAt', sortOrder = 'desc' } = params;

  return useQuery({
    queryKey: [...CLIENTS_KEY, page, limit, searchQuery, statusFilter, sortBy, sortOrder],
    queryFn: async () => {
      const queryParams: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        role: 'user',
      };
      if (searchQuery) queryParams['filters.search'] = searchQuery;
      if (statusFilter === 'active') queryParams['filters.isActive'] = 'true';
      if (statusFilter === 'inactive') queryParams['filters.isActive'] = 'false';

      const response = await apiRequest<ClientsResponse>(
        '/api/v1/users',
        'GET',
        undefined,
        { params: queryParams },
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch clients');
      }

      return {
        clients: Array.isArray(response.data) ? response.data : [],
        pagination: response.pagination ?? {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      };
    },
    meta: { errorMessage: 'Error fetching clients' },
  });
}

export function useToggleClientStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
    }: {
      id: string;
      wasActive: boolean;
    }) => {
      await apiRequest(`/api/v1/users/${id}/toggle`, 'PATCH');
    },
    onSuccess: (_data, { wasActive }) => {
      qc.invalidateQueries({ queryKey: CLIENTS_KEY });
      toast.success(
        `Client ${wasActive ? 'deactivated' : 'activated'} successfully`,
      );
    },
    onError: () => {
      toast.error('Failed to update client status');
    },
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/v1/users/${id}`, 'DELETE');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CLIENTS_KEY });
      toast.success('Client deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete client');
    },
  });
}
