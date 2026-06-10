'use client';

import { clientLogger } from '@/lib/logger';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/services/apiClient';
import type { HeroBanner } from '../types';

const HERO_BANNERS_KEY = ['hero-banners'];

export function useHeroBanners() {
  return useQuery({
    queryKey: HERO_BANNERS_KEY,
    queryFn: async () => {
      const res = await api.get('/api/v1/hero-banners');
      return (res.data.data || []) as HeroBanner[];
    },
  });
}

function onError(err: unknown, label: string) {
  clientLogger.error(`Failed to ${label}:`, err);
  toast.error(
    axios.isAxiosError(err)
      ? err.response?.data?.message || err.message
      : `Failed to ${label}`,
  );
}

export function useCreateHeroBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => api.post('/api/v1/hero-banners', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: HERO_BANNERS_KEY }); },
    onError: (e) => onError(e, 'create banner'),
  });
}

export function useUpdateHeroBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.put(`/api/v1/hero-banners/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: HERO_BANNERS_KEY }); },
    onError: (e) => onError(e, 'update banner'),
  });
}

export function useDeleteHeroBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/hero-banners/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: HERO_BANNERS_KEY }); },
    onError: (e) => onError(e, 'delete banner'),
  });
}

export function useToggleHeroBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/api/v1/hero-banners/${id}/toggle`),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: HERO_BANNERS_KEY });
      toast.success(res.data.data?.isActive ? 'Activated' : 'Deactivated');
    },
    onError: (e) => onError(e, 'toggle banner'),
  });
}

export function useReorderHeroBanners() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orders: { id: string; order: number }[]) =>
      api.patch('/api/v1/hero-banners/reorder', { orders }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: HERO_BANNERS_KEY }); },
    onError: (e) => onError(e, 'reorder banners'),
  });
}

export function useUploadHeroBannerImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/api/v1/upload/hero-banner', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data?.url as string;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: HERO_BANNERS_KEY }); },
    onError: (e) => onError(e, 'upload image'),
  });
}
