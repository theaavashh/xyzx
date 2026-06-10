'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { StoreSection, StoreHours } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

function defaultStoreData(): StoreSection {
  return {
    title: 'Visit Our Store',
    subtitle: 'Come see us in person',
    description: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
    email: '',
    ctaText: 'Get Directions',
    ctaUrl: '#',
    hours: [{ days: 'Mon - Fri', hours: '9:00 AM - 6:00 PM' }],
    isActive: true,
  };
}

function mapStoreData(data: Record<string, any>): StoreSection {
  return {
    id: data.id,
    title: data.title || '',
    subtitle: data.subtitle || '',
    description: data.description || '',
    address: data.address || '',
    city: data.city || '',
    state: data.state || '',
    zip: data.zip || '',
    country: data.country || '',
    phone: data.phone || '',
    email: data.email || '',
    image: data.image || '',
    mapEmbedUrl: data.mapEmbedUrl || '',
    ctaText: data.ctaText || 'Get Directions',
    ctaUrl: data.ctaUrl || '#',
    hours: Array.isArray(data.hours)
      ? data.hours.map((h: Record<string, any>) => ({
          days: h.days || '',
          hours: h.hours || '',
          isActive: h.isActive ?? true,
        }))
      : [{ days: 'Mon - Fri', hours: '9:00 AM - 6:00 PM' }],
    isActive: data.isActive ?? true,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export function useStore() {
  const [storeData, setStoreData] = useState<StoreSection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v1/store-section`);
        if (response.ok) {
          const result = await response.json();
          if (mounted) setStoreData(mapStoreData(result.data));
        } else {
          if (mounted) setStoreData(defaultStoreData());
        }
      } catch {
        toast.error('Failed to load store section data');
        if (mounted) setStoreData(defaultStoreData());
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  return { storeData, setStoreData, isLoading };
}

export function useSaveStore() {
  const [isSaving, setIsSaving] = useState(false);

  const save = async (data: StoreSection): Promise<StoreSection> => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/store-section`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: data.title,
          subtitle: data.subtitle || undefined,
          description: data.description,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          country: data.country,
          phone: data.phone || undefined,
          email: data.email || undefined,
          image: data.image || undefined,
          mapEmbedUrl: data.mapEmbedUrl || undefined,
          ctaText: data.ctaText,
          ctaUrl: data.ctaUrl,
          hours: data.hours.map((h) => ({
            days: h.days,
            hours: h.hours,
            isActive: h.isActive ?? true,
          })),
          isActive: data.isActive,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to save store section');
      }

      const result = await response.json();
      toast.success('Store section updated successfully!');
      return mapStoreData(result.data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save store section';
      toast.error(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return { save, isSaving };
}

export function useToggleStore() {
  const [isToggling, setIsToggling] = useState(false);

  const toggle = async (): Promise<StoreSection> => {
    setIsToggling(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/store-section/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to toggle store section');
      }

      const result = await response.json();
      toast.success('Store section visibility toggled!');
      return mapStoreData(result.data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to toggle store section';
      toast.error(message);
      throw error;
    } finally {
      setIsToggling(false);
    }
  };

  return { toggle, isToggling };
}
