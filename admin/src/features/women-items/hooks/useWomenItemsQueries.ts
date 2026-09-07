'use client';

import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { clientLogger } from '@/lib/logger';
import { authHeaders } from '@/utils/authHeaders';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export function useWomenItemsQueries() {
  const [isSaving, setIsSaving] = useState(false);

  const fetchConfig = useCallback(async (): Promise<Record<string, string> | null> => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/women-items`);
      if (res.ok) {
        const json = await res.json();
        return json.data ?? null;
      }
      return null;
    } catch (error) {
      clientLogger.error('Error fetching women items config:', error);
      return null;
    }
  }, []);

  const fetchCategories = useCallback(async (): Promise<CategoryOption[]> => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/categories`, {
        credentials: 'include',
        headers: authHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data ?? [];
      }
      return [];
    } catch (error) {
      clientLogger.error('Error fetching categories:', error);
      return [];
    }
  }, []);

  const saveConfig = useCallback(
    async (data: Record<string, string>): Promise<boolean> => {
      setIsSaving(true);
      try {
        const res = await fetch(`${API_BASE}/api/v1/women-items`, {
          method: 'PUT',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          credentials: 'include',
          body: JSON.stringify(data),
        });
        if (res.ok) {
          toast.success('Women Items updated successfully');
          return true;
        }
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || 'Failed to update Women Items');
        return false;
      } catch (error) {
        clientLogger.error('Error saving women items config:', error);
        toast.error('An error occurred while saving');
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_BASE}/api/v1/upload/women-items`, {
          method: 'POST',
          credentials: 'include',
          headers: authHeaders(),
          body: formData,
        });
        if (res.ok) {
          const json = await res.json();
          return json.data?.url ?? null;
        }
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || 'Failed to upload image');
        return null;
      } catch (error) {
        clientLogger.error('Error uploading women items image:', error);
        toast.error('An error occurred while uploading');
        return null;
      }
    },
    [],
  );

  return { isSaving, fetchConfig, fetchCategories, saveConfig, uploadImage };
}
