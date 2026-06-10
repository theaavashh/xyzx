'use client';

import { clientLogger } from '@/lib/logger';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '@/utils/api';
import type { RewardSettings } from '../types';

export function useRewardSettings() {
  const [settings, setSettings] = useState<RewardSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiRequest<{ success: boolean; data: RewardSettings }>('/api/v1/rewards/settings');
      const data = res.data ?? null;
      setSettings(data);
      return data;
    } catch (error) {
      clientLogger.error('Error fetching reward settings:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings, setSettings, loading, refetch: fetchSettings };
}

export function useSaveRewardSettings() {
  const [saving, setSaving] = useState(false);

  const save = async (formData: { amountUnit: number; rewardValue: number; isActive: boolean }): Promise<RewardSettings | null> => {
    try {
      setSaving(true);
      const res = await apiRequest<{ success: boolean; data: RewardSettings }>('/api/v1/rewards/settings', 'PUT', formData);
      toast.success('Reward settings saved successfully');
      return res.data ?? null;
    } catch (error) {
      clientLogger.error('Error saving reward settings:', error);
      toast.error('Failed to save reward settings');
      return null;
    } finally {
      setSaving(false);
    }
  };

  return { save, saving };
}
