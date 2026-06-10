import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '@/utils/api';
import { clientLogger } from '@/lib/logger';
import type { ApiIntegrationSettings } from '../types';

export function useApiIntegrationQueries() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async (): Promise<ApiIntegrationSettings | null> => {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; data: ApiIntegrationSettings }>('/api/v1/settings');
      return res.data ?? null;
    } catch (error) {
      clientLogger.error('Error fetching API integration settings:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSettings = useCallback(async (formData: Omit<ApiIntegrationSettings, 'id'>) => {
    setSaving(true);
    try {
      await apiRequest('/api/v1/settings', 'PUT', formData);
      toast.success('API integration settings saved successfully');
    } catch (error) {
      clientLogger.error('Error saving API integration settings:', error);
      toast.error('Failed to save API integration settings');
    } finally {
      setSaving(false);
    }
  }, []);

  return { loading, saving, fetchSettings, saveSettings };
}
