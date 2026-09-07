'use client';

import { clientLogger } from '@/lib/logger';
import { authHeaders } from '@/utils/authHeaders';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { FeaturedSection, FeaturedSectionFormData } from '../types';

export function useFeaturedSections() {
  const [featuredSections, setFeaturedSections] = useState<FeaturedSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await globalThis.fetch('/api/v1/featured-sections', { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setFeaturedSections(data.data || []);
      } else {
        clientLogger.error(`Failed to fetch featured sections: ${res.status}`);
        toast.error(`Failed to fetch featured sections (${res.status}).`);
      }
    } catch (error) {
      clientLogger.error('Error fetching featured sections:', error);
      toast.error('An error occurred while fetching featured sections.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleResponse = async (
    url: string,
    options: RequestInit,
    successMsg: string,
  ) => {
    setIsMutating(true);
    try {
      const res = await globalThis.fetch(url, { credentials: 'include', ...options });
      if (res.ok) {
        toast.success(successMsg);
        await load();
        return true;
      }
      const errData = await res.json();
      toast.error(errData.message || 'Request failed');
      return false;
    } catch (error) {
      clientLogger.error('Mutation error:', error);
      toast.error('An error occurred. Please try again.');
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const createSection = useCallback(
    (data: FeaturedSectionFormData) =>
      handleResponse('/api/v1/featured-sections', { method: 'POST', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data) }, 'Featured section created'),
    [],
  );

  const updateSection = useCallback(
    (id: string, data: FeaturedSectionFormData) =>
      handleResponse(`/api/v1/featured-sections/${id}`, { method: 'PUT', headers: authHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data) }, 'Featured section updated'),
    [],
  );

  const deleteSection = useCallback(
    (section: FeaturedSection) =>
      handleResponse(`/api/v1/featured-sections/${section.id}`, { method: 'DELETE', headers: authHeaders() }, 'Featured section deleted'),
    [],
  );

  const toggleStatus = useCallback(
    (section: FeaturedSection) =>
      handleResponse(`/api/v1/featured-sections/${section.id}/toggle`, { method: 'PATCH', headers: authHeaders() }, `Featured section ${section.isActive ? 'deactivated' : 'activated'}`),
    [],
  );

  const reorder = useCallback(
    (sectionId: string, direction: 'up' | 'down') => {
      const idx = featuredSections.findIndex((s) => s.id === sectionId);
      if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === featuredSections.length - 1)) return;
      const updated = [...featuredSections];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const tmp = updated[idx].order;
      updated[idx].order = updated[targetIdx].order;
      updated[targetIdx].order = tmp;
      updated.sort((a, b) => a.order - b.order);
      setIsMutating(true);
      globalThis.fetch('/api/v1/featured-sections/reorder', {
        method: 'PATCH',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify({ orders: updated.map((s, i) => ({ id: s.id, order: i })) }),
      }).then((res) => {
        if (res.ok) { setFeaturedSections(updated); toast.success('Sections reordered'); }
        else { toast.error('Failed to reorder'); load(); }
      }).catch(() => { toast.error('Reorder failed'); load(); })
      .finally(() => setIsMutating(false));
    },
    [featuredSections, load],
  );

  const uploadImage = useCallback(async (): Promise<string | null> => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      return new Promise((resolve) => {
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) return resolve(null);
          setIsMutating(true);
          try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await globalThis.fetch('/api/v1/upload/featured-section', { method: 'POST', credentials: 'include', headers: authHeaders(), body: fd });
            if (res.ok) {
              const data = await res.json();
              const url: string | undefined = data.data?.url || data.url;
              if (url) { toast.success('Image uploaded'); resolve(url); }
              else { toast.error('Failed to get image URL'); resolve(null); }
            } else { toast.error('Failed to upload image'); resolve(null); }
          } catch {
            toast.error('Upload failed'); resolve(null);
          } finally { setIsMutating(false); }
        };
        input.click();
      });
    } catch { toast.error('Failed to initiate upload'); return null; }
  }, []);

  return {
    featuredSections, isLoading, isMutating, refetch: load,
    createSection, updateSection, deleteSection, toggleStatus, reorder, uploadImage,
  };
}
