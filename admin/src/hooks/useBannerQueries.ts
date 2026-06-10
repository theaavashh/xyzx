'use client';

import { clientLogger } from '@/lib/logger';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { bannerService } from '@/services/banner.service';
import type { BannerFormData } from '@/types/banner.types';

const BANNER_QUERY_KEY = ['banners'];

export const useBanners = () => {
  return useQuery({
    queryKey: BANNER_QUERY_KEY,
    queryFn: bannerService.getAll,
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BannerFormData) => bannerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNER_QUERY_KEY });
      toast.success('Banner created successfully');
    },
    onError: (error) => {
      clientLogger.error('Failed to create banner:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to create banner';
      toast.error(message);
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BannerFormData }) =>
      bannerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNER_QUERY_KEY });
      toast.success('Banner updated successfully');
    },
    onError: (error) => {
      clientLogger.error('Failed to update banner:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to update banner';
      toast.error(message);
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bannerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNER_QUERY_KEY });
      toast.success('Banner deleted successfully');
    },
    onError: (error) => {
      clientLogger.error('Failed to delete banner:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to delete banner';
      toast.error(message);
    },
  });
};

export const useToggleBannerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bannerService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANNER_QUERY_KEY });
      toast.success('Banner status updated');
    },
    onError: (error) => {
      clientLogger.error('Failed to update banner status:', error);
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : 'Failed to update banner status';
      toast.error(message);
    },
  });
};
