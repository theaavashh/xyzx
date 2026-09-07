'use client';

import { useCallback, useEffect, useState } from 'react';
import { clientLogger } from '@/lib/logger';
import { authHeaders } from '@/utils/authHeaders';
import toast from 'react-hot-toast';
import type { ThreeImageGridSection, ThreeImageGridColumnItem } from '../types';

function baseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
}

export function useThreeImageGridQueries() {
  const [sections, setSections] = useState<ThreeImageGridSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!baseUrl()) {
        toast.error('Configuration error: API_BASE_URL is not set');
        return;
      }
      const response = await fetch(`${baseUrl()}/api/v1/three-image-grid`, {
        credentials: 'include',
        headers: authHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setSections(data.data || []);
      } else {
        toast.error('Failed to fetch three image grid sections');
      }
    } catch (error) {
      clientLogger.error('Error fetching three image grid sections:', error);
      toast.error('An error occurred while fetching sections');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
  }, [fetchAll]);

  const createOrUpdate = useCallback(
    async (columns: ThreeImageGridColumnItem[], editingItem: ThreeImageGridSection | null, isActive: boolean, order: number): Promise<boolean> => {
      try {
        if (!baseUrl()) {
          toast.error('Configuration error: API_BASE_URL is not set');
          return false;
        }
        const payload = {
          isActive,
          order,
          columns: columns.map((col, i) => ({
            imageSrc: col.imageSrc,
            imageAlt: col.imageAlt,
            imageLink: col.imageLink || undefined,
            productName: col.productName || undefined,
            productPrice: col.productPrice ? parseFloat(col.productPrice) : undefined,
            productOriginalPrice: col.productOriginalPrice ? parseFloat(col.productOriginalPrice) : undefined,
            productImage: col.productImage || undefined,
            productLink: col.productLink || undefined,
            order: i,
          })),
        };
        const url = editingItem
          ? `${baseUrl()}/api/v1/three-image-grid/${editingItem.id}`
          : `${baseUrl()}/api/v1/three-image-grid`;
        const response = await fetch(url, {
          method: editingItem ? 'PUT' : 'POST',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          toast.success(editingItem ? 'Section updated successfully' : 'Section created successfully');
          await fetchAll();
          return true;
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || 'Failed to save section');
          return false;
        }
      } catch (error) {
        clientLogger.error('Error saving section:', error);
        toast.error('An error occurred while saving');
        return false;
      }
    },
    [fetchAll],
  );

  const remove = useCallback(
    async (item: ThreeImageGridSection): Promise<boolean> => {
      try {
        if (!baseUrl()) {
          toast.error('Configuration error: API_BASE_URL is not set');
          return false;
        }
        const response = await fetch(`${baseUrl()}/api/v1/three-image-grid/${item.id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: authHeaders(),
        });
        if (response.ok) {
          toast.success('Section deleted successfully');
          await fetchAll();
          return true;
        } else {
          toast.error('Failed to delete section');
          return false;
        }
      } catch (error) {
        clientLogger.error('Error deleting section:', error);
        toast.error('An error occurred while deleting');
        return false;
      }
    },
    [fetchAll],
  );

  const toggleStatus = useCallback(
    async (item: ThreeImageGridSection) => {
      try {
        if (!baseUrl()) {
          toast.error('Configuration error: API_BASE_URL is not set');
          return;
        }
        const response = await fetch(`${baseUrl()}/api/v1/three-image-grid/${item.id}/toggle`, {
          method: 'PATCH',
          credentials: 'include',
          headers: authHeaders(),
        });
        if (response.ok) {
          toast.success('Status updated successfully');
          await fetchAll();
        } else {
          toast.error('Failed to toggle status');
        }
      } catch (error) {
        clientLogger.error('Error toggling status:', error);
        toast.error('An error occurred while toggling status');
      }
    },
    [fetchAll],
  );

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    if (!file) return null;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return null;
    }
    setIsUploading(true);
    try {
      if (!baseUrl()) {
        toast.error('Configuration error: API_BASE_URL is not set');
        return null;
      }
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${baseUrl()}/api/v1/upload/three-image-grid`, {
        method: 'POST',
        credentials: 'include',
        headers: authHeaders(),
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        const url = data.data?.url;
        if (url) {
          toast.success('Image uploaded successfully');
          return url;
        }
      }
      toast.error('Failed to upload image');
      return null;
    } catch (error) {
      clientLogger.error('Error uploading image:', error);
      toast.error('An error occurred while uploading');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    sections,
    isLoading,
    isUploading,
    fetchAll,
    createOrUpdate,
    remove,
    toggleStatus,
    uploadImage,
  };
}
