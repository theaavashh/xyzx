import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiRequest } from '@/utils/api';

export interface PromotionalBanner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  textColor: string;
  link: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type PromotionalBannerFormData = Omit<PromotionalBanner, 'id' | 'createdAt' | 'updatedAt'>;

export function usePromotionalBanners() {
  return useQuery<PromotionalBanner[]>({
    queryKey: ['promotional-banners'],
    queryFn: async () => {
      const res = await apiRequest<PromotionalBanner[]>('/api/v1/promotional-banners?limit=100');
      return Array.isArray(res) ? res : (res as any)?.data ?? [];
    },
  });
}

export function useCreatePromotionalBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PromotionalBannerFormData) =>
      apiRequest('/api/v1/promotional-banners', 'POST', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['promotional-banners'] }); toast.success('Banner created'); },
    onError: (err: any) => toast.error(err.message || 'Failed to create'),
  });
}

export function useUpdatePromotionalBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PromotionalBannerFormData> }) =>
      apiRequest(`/api/v1/promotional-banners/${id}`, 'PUT', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['promotional-banners'] }); toast.success('Banner updated'); },
    onError: (err: any) => toast.error(err.message || 'Failed to update'),
  });
}

export function useDeletePromotionalBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiRequest(`/api/v1/promotional-banners/${id}`, 'DELETE'),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['promotional-banners'] }); toast.success('Banner deleted'); },
    onError: (err: any) => toast.error(err.message || 'Failed to delete'),
  });
}

export function useTogglePromotionalBannerStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiRequest(`/api/v1/promotional-banners/${id}/toggle`, 'PATCH'),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['promotional-banners'] }); toast.success('Status updated'); },
    onError: (err: any) => toast.error(err.message || 'Failed to toggle'),
  });
}
