import api from './apiClient';
import type {
  Coupon,
  CouponFormData,
  CouponResponse,
  CouponSingleResponse,
  CouponStatsResponse,
  CouponStats,
} from '@/types/coupon.types';

export const couponService = {
  getAll: async (): Promise<Coupon[]> => {
    const response = await api.get<CouponResponse>('/api/v1/coupons');
    return response.data.data;
  },

  getById: async (id: string): Promise<Coupon> => {
    const response = await api.get<CouponSingleResponse>(`/api/v1/coupons/${id}`);
    return response.data.data;
  },

  getStats: async (): Promise<CouponStats> => {
    const response = await api.get<CouponStatsResponse>('/api/v1/coupons/stats');
    return response.data.data;
  },

  create: async (data: CouponFormData): Promise<Coupon> => {
    const response = await api.post<CouponSingleResponse>('/api/v1/coupons', data);
    return response.data.data;
  },

  update: async (id: string, data: CouponFormData): Promise<Coupon> => {
    const response = await api.put<CouponSingleResponse>(
      `/api/v1/coupons/${id}`,
      data,
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/coupons/${id}`);
  },

  toggleStatus: async (id: string): Promise<Coupon> => {
    const response = await api.patch<CouponSingleResponse>(
      `/api/v1/coupons/${id}/toggle`,
    );
    return response.data.data;
  },
};
