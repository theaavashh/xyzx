import api from './apiClient';
import type {
  Banner,
  BannerFormData,
  BannerResponse,
  BannerSingleResponse,
} from '@/types/banner.types';

export const bannerService = {
  getAll: async (): Promise<Banner[]> => {
    const response = await api.get<BannerResponse>('/api/v1/banners');
    return response.data.data;
  },

  getById: async (id: string): Promise<Banner> => {
    const response = await api.get<BannerSingleResponse>(`/api/v1/banners/${id}`);
    return response.data.data;
  },

  create: async (data: BannerFormData): Promise<Banner> => {
    const response = await api.post<BannerSingleResponse>('/api/v1/banners', data);
    return response.data.data;
  },

  update: async (id: string, data: BannerFormData): Promise<Banner> => {
    const response = await api.put<BannerSingleResponse>(
      `/api/v1/banners/${id}`,
      data,
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/banners/${id}`);
  },

  toggleStatus: async (id: string): Promise<Banner> => {
    const response = await api.patch<BannerSingleResponse>(
      `/api/v1/banners/${id}/toggle`,
    );
    return response.data.data;
  },
};
