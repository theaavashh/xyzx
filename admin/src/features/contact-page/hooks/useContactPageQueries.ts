'use client';

import { clientLogger } from '@/lib/logger';
import { authHeaders } from '@/utils/authHeaders';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { ContactPageSettings, ContactPageFormData } from '../types';

export function useContactPage() {
  const [settings, setSettings] = useState<ContactPageSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await globalThis.fetch('/api/v1/contact-page', { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.data || null);
      } else {
        clientLogger.error(`Failed to fetch contact page settings: ${res.status}`);
      }
    } catch (error) {
      clientLogger.error('Error fetching contact page settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = useCallback(async (data: ContactPageFormData) => {
    setIsSaving(true);
    try {
      const res = await globalThis.fetch('/api/v1/contact-page', {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        setSettings(result.data);
        toast.success('Contact page settings saved');
        return result.data;
      }
      const err = await res.json();
      toast.error(err.message || 'Failed to save');
      return null;
    } catch (error) {
      clientLogger.error('Error saving contact page settings:', error);
      toast.error('An error occurred');
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { settings, isLoading, isSaving, save };
}
