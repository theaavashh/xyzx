'use client';

import { clientLogger } from '@/lib/logger';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { couponService } from '@/services/coupon.service';
import type { CouponFormData } from '@/types/coupon.types';

const COUPON_QUERY_KEY = ['coupons'];
const COUPON_STATS_KEY = ['coupon-stats'];

export const useCoupons = () => {
  return useQuery({
    queryKey: COUPON_QUERY_KEY,
    queryFn: couponService.getAll,
  });
};

export const useCouponStats = () => {
  return useQuery({
    queryKey: COUPON_STATS_KEY,
    queryFn: couponService.getStats,
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CouponFormData) => couponService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPON_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: COUPON_STATS_KEY });
      toast.success('Coupon created successfully');
    },
    onError: (error) => {
      clientLogger.error('Failed to create coupon:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to create coupon';
      toast.error(message);
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CouponFormData }) =>
      couponService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPON_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: COUPON_STATS_KEY });
      toast.success('Coupon updated successfully');
    },
    onError: (error) => {
      clientLogger.error('Failed to update coupon:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to update coupon';
      toast.error(message);
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => couponService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPON_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: COUPON_STATS_KEY });
      toast.success('Coupon deleted successfully');
    },
    onError: (error) => {
      clientLogger.error('Failed to delete coupon:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to delete coupon';
      toast.error(message);
    },
  });
};

export const useToggleCouponStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => couponService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COUPON_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: COUPON_STATS_KEY });
      toast.success('Coupon status updated');
    },
    onError: (error) => {
      clientLogger.error('Failed to update coupon status:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to update coupon status';
      toast.error(message);
    },
  });
};
