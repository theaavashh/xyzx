'use client';

import { clientLogger } from '@/lib/logger';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { AboutSection, AboutSectionFormData } from '../types';

export function useAboutSections() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await globalThis.fetch('/api/v1/about');
      if (res.ok) {
        const data = await res.json();
        setSections(data.data || []);
      } else {
        clientLogger.error(`Failed to fetch about sections: ${res.status}`);
        toast.error(`Failed to fetch about sections (${res.status}).`);
      }
    } catch (error) {
      clientLogger.error('Error fetching about sections:', error);
      toast.error('An error occurred while fetching about sections.');
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
    (data: AboutSectionFormData) =>
      handleResponse('/api/v1/about', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }, 'About section created'),
    [],
  );

  const updateSection = useCallback(
    (id: string, data: AboutSectionFormData) =>
      handleResponse(`/api/v1/about/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }, 'About section updated'),
    [],
  );

  const deleteSection = useCallback(
    (section: AboutSection) =>
      handleResponse(`/api/v1/about/${section.id}`, { method: 'DELETE' }, 'About section deleted'),
    [],
  );

  const toggleStatus = useCallback(
    (section: AboutSection) =>
      handleResponse(`/api/v1/about/${section.id}/toggle`, { method: 'PATCH' }, `About section ${section.isActive ? 'deactivated' : 'activated'}`),
    [],
  );

  return {
    sections, isLoading, isMutating, refetch: load,
    createSection, updateSection, deleteSection, toggleStatus,
  };
}
