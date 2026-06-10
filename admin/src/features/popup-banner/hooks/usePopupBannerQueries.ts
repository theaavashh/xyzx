'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PopupBannerData } from '../types';

const POPUP_BANNER_KEY = ['popup-banner'];

const MOCK_INITIAL_DATA: PopupBannerData = {
  id: '1',
  image:
    'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&h=400&fit=crop',
  isActive: true,
  position: 'center',
  size: 'medium',
  lastUpdated: new Date().toISOString(),
};

export function usePopupBanner() {
  return useQuery({
    queryKey: POPUP_BANNER_KEY,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { ...MOCK_INITIAL_DATA };
    },
  });
}

export function useUpdatePopupBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: PopupBannerData) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { ...data, lastUpdated: new Date().toISOString() };
    },
    onSuccess: (data) => {
      qc.setQueryData(POPUP_BANNER_KEY, data);
    },
  });
}
