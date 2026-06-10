'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { clientLogger } from '@/lib/logger';
import toast from 'react-hot-toast';
import api from '@/services/apiClient';
import type { NavItem, NavigationFormData } from '../types';

const NAV_KEY = ['navigation'];

function onError(err: unknown, label: string) {
  clientLogger.error(`Failed to ${label}:`, err);
  toast.error(
    axios.isAxiosError(err)
      ? err.response?.data?.message || err.message
      : `Failed to ${label}`,
  );
}

export function useNavigationItems() {
  return useQuery({
    queryKey: NAV_KEY,
    queryFn: async () => {
      const res = await api.get('/api/v1/navigation');
      return (res.data?.data || []) as NavItem[];
    },
  });
}

export function useCreateNavigationItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: NavigationFormData) => api.post('/api/v1/navigation', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NAV_KEY });
      toast.success('Navigation item created');
    },
    onError: (e) => onError(e, 'create navigation item'),
  });
}

export function useUpdateNavigationItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NavigationFormData }) =>
      api.put(`/api/v1/navigation/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NAV_KEY });
      toast.success('Navigation item updated');
    },
    onError: (e) => onError(e, 'update navigation item'),
  });
}

export function useDeleteNavigationItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/navigation/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NAV_KEY });
      toast.success('Navigation item deleted');
    },
    onError: (e) => onError(e, 'delete navigation item'),
  });
}

export function useToggleNavigationItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/api/v1/navigation/${id}/toggle`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NAV_KEY });
      toast.success('Status updated');
    },
    onError: (e) => onError(e, 'toggle status'),
  });
}

export function useReorderNavigationItems() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orders: { id: string; order: number }[]) =>
      api.patch('/api/v1/navigation/reorder', { orders }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: NAV_KEY });
      toast.success('Reordered successfully');
    },
    onError: (e) => onError(e, 'reorder'),
  });
}
