'use client';

import { clientLogger } from '@/lib/logger';
import { authHeaders } from '@/utils/authHeaders';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { ImageGridItem, ImageGridForm } from '../types';

function baseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
}

export function useImageGridQueries() {
  const [items, setItems] = useState<ImageGridItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!baseUrl()) {
        clientLogger.error('API_BASE_URL environment variable is not set');
        toast.error('Configuration error: API_BASE_URL is not set');
        return;
      }
      const response = await fetch(
        `${baseUrl()}/api/v1/image-grid`,
        { credentials: 'include', headers: authHeaders() },
      );
      if (response.ok) {
        const data = await response.json();
        setItems(data.data || []);
      } else {
        clientLogger.error('Failed to fetch image grid items');
        toast.error('Failed to fetch image grid items. Please check your connection and try again.');
      }
    } catch (error) {
      clientLogger.error('Error fetching image grid items:', error);
      toast.error('An error occurred while fetching image grid items. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createOrUpdate = useCallback(
    async (form: ImageGridForm, editingItem: ImageGridItem | null): Promise<boolean> => {
      try {
        if (!baseUrl()) {
          toast.error('Configuration error: API_BASE_URL is not set');
          return false;
        }
        const url = editingItem
          ? `${baseUrl()}/api/v1/image-grid/${editingItem.id}`
          : `${baseUrl()}/api/v1/image-grid`;
        const response = await fetch(url, {
          method: editingItem ? 'PUT' : 'POST',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          credentials: 'include',
          body: JSON.stringify({
            ...form,
            title: form.title || null,
            subtitle: form.subtitle || null,
            link: form.link || null,
          }),
        });
        if (response.ok) {
          toast.success(
            editingItem
              ? 'Image grid item updated successfully'
              : 'Image grid item created successfully',
          );
          await fetchAll();
          return true;
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || 'Failed to save image grid item');
          return false;
        }
      } catch (error) {
        clientLogger.error('Error saving image grid item:', error);
        toast.error('An error occurred while saving. Please try again.');
        return false;
      }
    },
    [fetchAll],
  );

  const remove = useCallback(
    async (item: ImageGridItem): Promise<boolean> => {
      try {
        if (!baseUrl()) {
          toast.error('Configuration error: API_BASE_URL is not set');
          return false;
        }
        const response = await fetch(
          `${baseUrl()}/api/v1/image-grid/${item.id}`,
          {
            method: 'DELETE',
            credentials: 'include',
            headers: authHeaders(),
          },
        );
        if (response.ok) {
          toast.success('Image grid item deleted successfully');
          await fetchAll();
          return true;
        } else {
          toast.error('Failed to delete image grid item');
          return false;
        }
      } catch (error) {
        clientLogger.error('Error deleting image grid item:', error);
        toast.error('An error occurred while deleting. Please try again.');
        return false;
      }
    },
    [fetchAll],
  );

  const toggleStatus = useCallback(
    async (item: ImageGridItem) => {
      try {
        if (!baseUrl()) {
          toast.error('Configuration error: API_BASE_URL is not set');
          return;
        }
        const response = await fetch(
          `${baseUrl()}/api/v1/image-grid/${item.id}/toggle`,
          {
            method: 'PATCH',
            credentials: 'include',
            headers: authHeaders(),
          },
        );
        if (response.ok) {
          const data = await response.json();
          toast.success(
            `Image grid item ${(data.data as { isActive: boolean }).isActive ? 'activated' : 'deactivated'} successfully`,
          );
          await fetchAll();
        } else {
          toast.error('Failed to toggle image grid item status');
        }
      } catch (error) {
        clientLogger.error('Error toggling image grid item status:', error);
        toast.error('An error occurred while toggling status. Please try again.');
      }
    },
    [fetchAll],
  );

  const reorder = useCallback(
    async (itemId: string, direction: 'up' | 'down') => {
      const currentIndex = items.findIndex((item) => item.id === itemId);
      if (
        (direction === 'up' && currentIndex === 0) ||
        (direction === 'down' && currentIndex === items.length - 1)
      ) {
        return;
      }

      const newOrder = [...items];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      const temp = newOrder[currentIndex].order;
      newOrder[currentIndex].order = newOrder[targetIndex].order;
      newOrder[targetIndex].order = temp;
      newOrder.sort((a, b) => a.order - b.order);

      try {
        if (!baseUrl()) {
          toast.error('Configuration error: API_BASE_URL is not set');
          return;
        }
        const orders = newOrder.map((item, index) => ({
          id: item.id,
          order: index,
        }));
        const response = await fetch(
          `${baseUrl()}/api/v1/image-grid/reorder`,
          {
            method: 'PATCH',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            credentials: 'include',
            body: JSON.stringify({ orders }),
          },
        );
        if (response.ok) {
          setItems(newOrder);
          toast.success('Image grid items reordered successfully');
        } else {
          toast.error('Failed to reorder image grid items');
          await fetchAll();
        }
      } catch (error) {
        clientLogger.error('Error reordering image grid items:', error);
        toast.error('An error occurred while reordering. Please try again.');
        await fetchAll();
      }
    },
    [items, fetchAll],
  );

  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      if (!file) return null;
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        return null;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
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
        const response = await fetch(
          `${baseUrl()}/api/v1/upload/image-grid`,
          {
            method: 'POST',
            credentials: 'include',
            headers: authHeaders(),
            body: formData,
          },
        );
        if (response.ok) {
          const data = await response.json();
          const imageUrl = data.data?.url;
          if (imageUrl) {
            toast.success('Image uploaded successfully');
            return imageUrl;
          } else {
            toast.error('Failed to get image URL from upload response');
            return null;
          }
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || 'Failed to upload image');
          return null;
        }
      } catch (error) {
        clientLogger.error('Error uploading image:', error);
        toast.error('An error occurred while uploading the image');
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  return {
    items,
    isLoading,
    isUploading,
    setItems,
    fetchAll,
    createOrUpdate,
    remove,
    toggleStatus,
    reorder,
    uploadImage,
  };
}
