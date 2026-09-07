'use client';

import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { clientLogger } from '@/lib/logger';
import { authHeaders } from '@/utils/authHeaders';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export function useShortDescription() {
  const [loading, setLoading] = useState(false);

  const fetchDescription = useCallback(async (): Promise<string> => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/short-description`);
      if (res.ok) {
        const json = await res.json();
        return json.data?.description ?? '';
      }
      return '';
    } catch (error) {
      clientLogger.error('Error fetching short description:', error);
      return '';
    }
  }, []);

  const saveDescription = useCallback(async (description: string): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/short-description`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify({ description }),
      });
      if (res.ok) {
        toast.success('Short description updated successfully');
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || 'Failed to update short description');
      }
    } catch (error) {
      clientLogger.error('Error saving short description:', error);
      toast.error('An error occurred while saving');
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, fetchDescription, saveDescription };
}
