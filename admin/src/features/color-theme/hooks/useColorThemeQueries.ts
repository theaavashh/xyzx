'use client';

import { clientLogger } from '@/lib/logger';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiWrapper } from '@/services/apiClient';
import type { ColorSettings } from '../types';
import { defaultSettings, colorFields } from '../types';

const COLOR_THEME_KEY = ['color-theme'];

function filterColorSettings(response: Partial<ColorSettings>): ColorSettings {
  const filtered = {} as ColorSettings;
  for (const field of colorFields) {
    filtered[field] = response[field] || defaultSettings[field];
  }
  return filtered;
}

export function useColorTheme() {
  return useQuery({
    queryKey: COLOR_THEME_KEY,
    queryFn: async () => {
      const res = await apiWrapper.get<{ success: boolean; data: ColorSettings }>('/api/v1/settings');
      return filterColorSettings(res.data ?? res);
    },
  });
}

export function useUpdateColorTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings: ColorSettings) =>
      apiWrapper.put('/api/v1/settings', settings),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: COLOR_THEME_KEY });
      toast.success('Color theme saved successfully!');
    },
    onError: (error: unknown) => {
      clientLogger.error('Error saving color theme:', error);
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Failed to save color theme'
          : 'Failed to save color theme',
      );
    },
  });
}
