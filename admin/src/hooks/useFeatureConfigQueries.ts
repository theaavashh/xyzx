import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiRequest } from '@/utils/api';

export interface FeatureConfig {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type FeatureConfigFormData = Omit<FeatureConfig, 'id' | 'createdAt' | 'updatedAt'>;

export function useFeatureConfigs() {
  return useQuery<FeatureConfig[]>({
    queryKey: ['feature-configs'],
    queryFn: async () => {
      const res = await apiRequest<FeatureConfig[]>('/api/v1/feature-configs?limit=100');
      return Array.isArray(res) ? res : (res as any)?.data ?? [];
    },
  });
}

export function useCreateFeatureConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FeatureConfigFormData) =>
      apiRequest('/api/v1/feature-configs', 'POST', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['feature-configs'] }); toast.success('Feature created'); },
    onError: (err: any) => toast.error(err.message || 'Failed to create'),
  });
}

export function useUpdateFeatureConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FeatureConfigFormData> }) =>
      apiRequest(`/api/v1/feature-configs/${id}`, 'PUT', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['feature-configs'] }); toast.success('Feature updated'); },
    onError: (err: any) => toast.error(err.message || 'Failed to update'),
  });
}

export function useDeleteFeatureConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiRequest(`/api/v1/feature-configs/${id}`, 'DELETE'),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['feature-configs'] }); toast.success('Feature deleted'); },
    onError: (err: any) => toast.error(err.message || 'Failed to delete'),
  });
}

export function useToggleFeatureConfigStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiRequest(`/api/v1/feature-configs/${id}/toggle`, 'PATCH'),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['feature-configs'] }); toast.success('Status updated'); },
    onError: (err: any) => toast.error(err.message || 'Failed to toggle'),
  });
}
