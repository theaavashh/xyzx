'use client';

import { clientLogger } from '@/lib/logger';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { couponService } from '@/services/coupon.service';
import type { CouponFormData } from '@/types/coupon.types';

const COUPON_KEY = ['coupons'];
const STATS_KEY = ['coupon-stats'];

export const useCoupons = () =>
  useQuery({ queryKey: COUPON_KEY, queryFn: couponService.getAll });

export const useCouponStats = () =>
  useQuery({ queryKey: STATS_KEY, queryFn: couponService.getStats });

const onError = (error: unknown, label: string) => {
  clientLogger.error(`Failed to ${label}:`, error);
  toast.error(
    axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : `Failed to ${label}`,
  );
};

const invalidate = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: COUPON_KEY });
  qc.invalidateQueries({ queryKey: STATS_KEY });
};

export const useCreateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CouponFormData) => couponService.create(data),
    onSuccess: () => { invalidate(qc); toast.success('Coupon created'); },
    onError: (e) => onError(e, 'create coupon'),
  });
};

export const useUpdateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CouponFormData }) =>
      couponService.update(id, data),
    onSuccess: () => { invalidate(qc); toast.success('Coupon updated'); },
    onError: (e) => onError(e, 'update coupon'),
  });
};

export const useDeleteCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => couponService.delete(id),
    onSuccess: () => { invalidate(qc); toast.success('Coupon deleted'); },
    onError: (e) => onError(e, 'delete coupon'),
  });
};

export const useToggleCouponStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => couponService.toggleStatus(id),
    onSuccess: () => { invalidate(qc); toast.success('Coupon status updated'); },
    onError: (e) => onError(e, 'update coupon status'),
  });
};
