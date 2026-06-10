'use client';

import { clientLogger } from '@/lib/logger';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { ShopByCategory, ShopByCategoryForm } from '../types';

function baseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
}

export function useShopByCategoryQueries() {
  const [shopByCategories, setShopByCategories] = useState<ShopByCategory[]>(
    [],
  );
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
        `${baseUrl()}/api/v1/shop-by-categories`,
        { credentials: 'include' },
      );
      if (response.ok) {
        const data = await response.json();
        setShopByCategories(data.data || []);
      } else {
        clientLogger.error('Failed to fetch shop by categories');
        toast.error(
          'Failed to fetch shop by categories. Please check your connection and try again.',
        );
      }
    } catch (error) {
      clientLogger.error('Error fetching shop by categories:', error);
      toast.error(
        'An error occurred while fetching shop by categories. Please try again later.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createOrUpdate = useCallback(
    async (
      form: ShopByCategoryForm,
      editingItem: ShopByCategory | null,
    ): Promise<boolean> => {
      try {
        if (!baseUrl()) {
          toast.error('Configuration error: API_BASE_URL is not set');
          return false;
        }
        const url = editingItem
          ? `${baseUrl()}/api/v1/shop-by-categories/${editingItem.id}`
          : `${baseUrl()}/api/v1/shop-by-categories`;
        const response = await fetch(url, {
          method: editingItem ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(form),
        });
        if (response.ok) {
          toast.success(
            editingItem
              ? 'Shop by category updated successfully'
              : 'Shop by category created successfully',
          );
          await fetchAll();
          return true;
        } else {
          const errorData = await response.json();
          toast.error(
            errorData.message || 'Failed to save shop by category',
          );
          return false;
        }
      } catch (error) {
        clientLogger.error('Error saving shop by category:', error);
        toast.error(
          'An error occurred while saving the shop by category. Please try again.',
        );
        return false;
      }
    },
    [fetchAll],
  );

  const remove = useCallback(
    async (item: ShopByCategory): Promise<boolean> => {
      try {
        if (!baseUrl()) {
          toast.error('Configuration error: API_BASE_URL is not set');
          return false;
        }
        const response = await fetch(
          `${baseUrl()}/api/v1/shop-by-categories/${item.id}`,
          {
            method: 'DELETE',
            credentials: 'include',
          },
        );
        if (response.ok) {
          toast.success('Shop by category deleted successfully');
          await fetchAll();
          return true;
        } else {
          toast.error('Failed to delete shop by category');
          return false;
        }
      } catch (error) {
        clientLogger.error('Error deleting shop by category:', error);
        toast.error(
          'An error occurred while deleting the shop by category. Please try again.',
        );
        return false;
      }
    },
    [fetchAll],
  );

  const toggleStatus = useCallback(
    async (item: ShopByCategory) => {
      try {
        if (!baseUrl()) {
          toast.error('Configuration error: API_BASE_URL is not set');
          return;
        }
        const response = await fetch(
          `${baseUrl()}/api/v1/shop-by-categories/${item.id}/toggle`,
          {
            method: 'PATCH',
            credentials: 'include',
          },
        );
        if (response.ok) {
          const data = await response.json();
          toast.success(
            `Shop by category ${(data.data as { isActive: boolean }).isActive ? 'activated' : 'deactivated'} successfully`,
          );
          await fetchAll();
        } else {
          toast.error('Failed to toggle shop by category status');
        }
      } catch (error) {
        clientLogger.error('Error toggling shop by category status:', error);
        toast.error(
          'An error occurred while toggling the shop by category status. Please try again.',
        );
      }
    },
    [fetchAll],
  );

  const reorder = useCallback(
    async (itemId: string, direction: 'up' | 'down') => {
      const currentIndex = shopByCategories.findIndex(
        (item) => item.id === itemId,
      );
      if (
        (direction === 'up' && currentIndex === 0) ||
        (direction === 'down' &&
          currentIndex === shopByCategories.length - 1)
      ) {
        return;
      }

      const newOrder = [...shopByCategories];
      const targetIndex =
        direction === 'up' ? currentIndex - 1 : currentIndex + 1;

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
          `${baseUrl()}/api/v1/shop-by-categories/reorder`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ orders }),
          },
        );
        if (response.ok) {
          setShopByCategories(newOrder);
          toast.success('Shop by categories reordered successfully');
        } else {
          toast.error('Failed to reorder shop by categories');
          await fetchAll();
        }
      } catch (error) {
        clientLogger.error('Error reordering shop by categories:', error);
        toast.error(
          'An error occurred while reordering shop by categories. Please try again.',
        );
        await fetchAll();
      }
    },
    [shopByCategories, fetchAll],
  );

  const uploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      if (!file) return null;
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
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
          `${baseUrl()}/api/v1/upload/shop-by-category`,
          {
            method: 'POST',
            credentials: 'include',
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
    shopByCategories,
    isLoading,
    isUploading,
    setShopByCategories,
    fetchAll,
    createOrUpdate,
    remove,
    toggleStatus,
    reorder,
    uploadImage,
  };
}
