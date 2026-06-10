'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientLogger } from '@/lib/logger';
import toast from 'react-hot-toast';
import api from '@/services/apiClient';
import type { FollowSection } from '../types';

const FOLLOW_SECTION_KEY = ['follow-section'];

export function useFollowSection() {
  return useQuery({
    queryKey: FOLLOW_SECTION_KEY,
    queryFn: async () => {
      const res = await api.get('/api/v1/follow-section');
      return (res.data.data || []) as FollowSection[];
    },
  });
}

export function useCreateFollowSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post('/api/v1/follow-section', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FOLLOW_SECTION_KEY });
      toast.success('Follow section created successfully');
    },
    onError: (err: unknown) => {
      clientLogger.error('Error creating follow section:', err);
      toast.error('Failed to create follow section');
    },
  });
}

export function useUpdateFollowSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      api.put(`/api/v1/follow-section/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FOLLOW_SECTION_KEY });
      toast.success('Follow section updated successfully');
    },
    onError: (err: unknown) => {
      clientLogger.error('Error updating follow section:', err);
      toast.error('Failed to update follow section');
    },
  });
}

export function useDeleteFollowSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/follow-section/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FOLLOW_SECTION_KEY });
      toast.success('Follow section deleted successfully');
    },
    onError: (err: unknown) => {
      clientLogger.error('Error deleting follow section:', err);
      toast.error('Failed to delete follow section');
    },
  });
}

export function useToggleFollowSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.patch(`/api/v1/follow-section/${id}/toggle`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FOLLOW_SECTION_KEY });
      toast.success('Status updated successfully');
    },
    onError: (err: unknown) => {
      clientLogger.error('Error toggling follow section status:', err);
      toast.error('Failed to update status');
    },
  });
}

export function useUploadFollowSectionImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/api/v1/upload/follow-section', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return (res.data.data?.url || res.data.url) as string;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FOLLOW_SECTION_KEY });
      toast.success('Image uploaded successfully');
    },
    onError: (err: unknown) => {
      clientLogger.error('Error uploading image:', err);
      toast.error('Failed to upload image');
    },
  });
}
