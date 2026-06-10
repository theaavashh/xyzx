'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { AboutUsData } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

function mapContentToAbout(data: Record<string, any>): AboutUsData {
  return {
    id: data.id,
    slug: data.slug,
    title: data.title || '',
    content: data.content || '',
    metaTitle: data.metaTitle || '',
    metaDescription: data.metaDescription || '',
    isActive: data.isActive ?? true,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    lastUpdated: data.updatedAt || data.createdAt,
  };
}

export function useAboutData() {
  const [aboutData, setAboutData] = useState<AboutUsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v1/content/slug/about`);
        if (response.ok) {
          const result = await response.json();
          if (mounted) setAboutData(mapContentToAbout(result.data));
        } else {
          // Page doesn't exist yet — provide defaults
          if (mounted) {
            setAboutData({
              title: 'About RaphArch',
              content: '',
              metaTitle: 'About RaphArch - Premium Fashion',
              metaDescription: 'Learn about RaphArch, your destination for premium fashion and footwear.',
              isActive: true,
            });
          }
        }
      } catch {
        toast.error('Failed to load about us data');
        if (mounted) {
          setAboutData({
            title: 'About RaphArch',
            content: '',
            metaTitle: 'About RaphArch - Premium Fashion',
            metaDescription: 'Learn about RaphArch, your destination for premium fashion and footwear.',
            isActive: true,
          });
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  return { aboutData, setAboutData, isLoading };
}

export function useSaveAboutData() {
  const [isSaving, setIsSaving] = useState(false);

  const save = async (data: AboutUsData): Promise<AboutUsData> => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/content/about`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          key: 'about',
          title: data.title,
          content: data.content,
          metaTitle: data.metaTitle || undefined,
          metaDescription: data.metaDescription || undefined,
          isActive: data.isActive,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to save about us page');
      }

      const result = await response.json();
      toast.success('About Us page updated successfully!');
      return mapContentToAbout(result.data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save about us page';
      toast.error(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return { save, isSaving };
}
