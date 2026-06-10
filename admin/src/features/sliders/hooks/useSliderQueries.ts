'use client';

import { clientLogger } from '@/lib/logger';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { SliderImage, SliderFormData } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useSliders() {
  const [sliders, setSliders] = useState<SliderImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSliders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}/api/v1/sliders`,
        { credentials: 'include' },
      );
      if (!response.ok) throw new Error('Failed to fetch sliders');
      const data = await response.json();
      if (data.success) {
        setSliders(data.data.sliders || []);
      }
    } catch (error) {
      clientLogger.error('Error fetching sliders:', error);
      toast.error('Failed to fetch sliders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSliders();
  }, [fetchSliders]);

  return { sliders, setSliders, loading, refetch: fetchSliders };
}

export function useUploadSliderImage() {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch(
        `${BASE_URL}/api/v1/upload/slider`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        },
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Upload failed with status ${response.status}`,
        );
      }
      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      clientLogger.error('Upload error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload image';
      toast.error(errorMessage);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading };
}

export function useSaveSlider() {
  const [saving, setSaving] = useState(false);

  const save = async (
    formData: SliderFormData,
    editingSlider: SliderImage | null,
    currentCount: number,
  ): Promise<SliderImage> => {
    setSaving(true);
    try {
      const sliderData = {
        imageUrl: formData.imageUrl,
        internalLink: formData.internalLink,
        isActive: formData.isActive,
        order: currentCount + 1,
      };
      const url = editingSlider
        ? `${BASE_URL}/api/v1/sliders/${editingSlider.id}`
        : `${BASE_URL}/api/v1/sliders/test`;
      const method = editingSlider ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(sliderData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        clientLogger.error('Slider save error:', errorData);
        throw new Error(
          errorData.message ||
            `Failed to save slider with status ${response.status}`,
        );
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to save slider');
      }
      return data.data.slider;
    } finally {
      setSaving(false);
    }
  };

  return { save, saving };
}

export function useDeleteSlider() {
  const [deleting, setDeleting] = useState(false);

  const remove = async (id: string): Promise<void> => {
    setDeleting(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/sliders/${id}`,
        { method: 'DELETE', credentials: 'include' },
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        clientLogger.error('Delete error response:', errorData);
        throw new Error(
          errorData.message ||
            `Failed to delete slider with status ${response.status}`,
        );
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete slider');
      }
    } catch (error) {
      clientLogger.error('Error deleting slider:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete slider';
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  return { remove, deleting };
}

export function useToggleSliderStatus() {
  const [toggling, setToggling] = useState(false);

  const toggle = async (id: string, isActive: boolean, onSuccess: () => void) => {
    setToggling(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/sliders/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ isActive: !isActive }),
        },
      );
      if (!response.ok) throw new Error('Failed to update slider');
      const data = await response.json();
      if (data.success) {
        toast.success('Slider status updated');
        onSuccess();
      }
    } catch (error) {
      clientLogger.error('Error updating slider:', error);
      toast.error('Failed to update slider');
    } finally {
      setToggling(false);
    }
  };

  return { toggle, toggling };
}

export function useReorderSliders() {
  const [reordering, setReordering] = useState(false);

  const reorder = async (sliders: SliderImage[]): Promise<void> => {
    setReordering(true);
    try {
      await Promise.all(
        sliders.map((slider) =>
          fetch(`${BASE_URL}/api/v1/sliders/${slider.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ order: slider.order }),
          }),
        ),
      );
    } catch (error) {
      clientLogger.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setReordering(false);
    }
  };

  return { reorder, reordering };
}
