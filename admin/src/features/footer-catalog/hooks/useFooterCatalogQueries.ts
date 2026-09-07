'use client';

import { clientLogger } from '@/lib/logger';
import { authHeaders } from '@/utils/authHeaders';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { FooterCatalog, FooterCatalogForm } from '../types';

function baseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
}

export function useFooterCatalogQueries() {
  const [catalogs, setCatalogs] = useState<FooterCatalog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!baseUrl()) {
        clientLogger.error('API_BASE_URL environment variable is not set');
        toast.error('Configuration error: API_BASE_URL is not set');
        return;
      }
      const response = await fetch(`${baseUrl()}/api/v1/footer-catalog`, {
        credentials: 'include',
        headers: authHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setCatalogs(data.data || []);
      } else {
        clientLogger.error('Failed to fetch footer catalogs');
        toast.error('Failed to fetch footer catalogs. Please check your connection and try again.');
      }
    } catch (error) {
      clientLogger.error('Error fetching footer catalogs:', error);
      toast.error('An error occurred while fetching footer catalogs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const createOrUpdate = useCallback(
    async (form: FooterCatalogForm, editingItem: FooterCatalog | null): Promise<boolean> => {
      try {
        if (!baseUrl()) {
          toast.error('Configuration error: API_BASE_URL is not set');
          return false;
        }
        const url = editingItem
          ? `${baseUrl()}/api/v1/footer-catalog/${editingItem.id}`
          : `${baseUrl()}/api/v1/footer-catalog`;
        const response = await fetch(url, {
          method: editingItem ? 'PUT' : 'POST',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          credentials: 'include',
          body: JSON.stringify(form),
        });
        if (response.ok) {
          toast.success(
            editingItem
              ? 'Footer catalog updated successfully'
              : 'Footer catalog created successfully',
          );
          await fetchAll();
          return true;
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || 'Failed to save footer catalog');
          return false;
        }
      } catch (error) {
        clientLogger.error('Error saving footer catalog:', error);
        toast.error(
          'An error occurred while saving the footer catalog. Please try again.',
        );
        return false;
      }
    },
    [fetchAll],
  );

  const remove = useCallback(
    async (item: FooterCatalog): Promise<boolean> => {
      try {
        if (!baseUrl()) {
          toast.error('Configuration error: API_BASE_URL is not set');
          return false;
        }
        const response = await fetch(
          `${baseUrl()}/api/v1/footer-catalog/${item.id}`,
          {
            method: 'DELETE',
            credentials: 'include',
            headers: authHeaders(),
          },
        );
        if (response.ok) {
          toast.success('Footer catalog deleted successfully');
          await fetchAll();
          return true;
        } else {
          toast.error('Failed to delete footer catalog');
          return false;
        }
      } catch (error) {
        clientLogger.error('Error deleting footer catalog:', error);
        toast.error(
          'An error occurred while deleting the footer catalog. Please try again.',
        );
        return false;
      }
    },
    [fetchAll],
  );

  const toggleStatus = useCallback(
    async (item: FooterCatalog) => {
      try {
        if (!baseUrl()) {
          toast.error('Configuration error: API_BASE_URL is not set');
          return;
        }
        const response = await fetch(
          `${baseUrl()}/api/v1/footer-catalog/${item.id}/toggle`,
          {
            method: 'PATCH',
            credentials: 'include',
            headers: authHeaders(),
          },
        );
        if (response.ok) {
          const data = await response.json();
          toast.success(
            `Footer catalog ${(data.data as { isActive: boolean }).isActive ? 'activated' : 'deactivated'} successfully`,
          );
          await fetchAll();
        } else {
          toast.error('Failed to toggle footer catalog status');
        }
      } catch (error) {
        clientLogger.error('Error toggling footer catalog status:', error);
        toast.error(
          'An error occurred while toggling the footer catalog status. Please try again.',
        );
      }
    },
    [fetchAll],
  );

  const reorder = useCallback(
    async (itemId: string, direction: 'up' | 'down') => {
      const currentIndex = catalogs.findIndex((item) => item.id === itemId);
      if (
        (direction === 'up' && currentIndex === 0) ||
        (direction === 'down' && currentIndex === catalogs.length - 1)
      ) {
        return;
      }

      const newOrder = [...catalogs];
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
          `${baseUrl()}/api/v1/footer-catalog/reorder`,
          {
            method: 'PATCH',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            credentials: 'include',
            body: JSON.stringify({ orders }),
          },
        );
        if (response.ok) {
          setCatalogs(newOrder);
          toast.success('Footer catalogs reordered successfully');
        } else {
          toast.error('Failed to reorder footer catalogs');
          await fetchAll();
        }
      } catch (error) {
        clientLogger.error('Error reordering footer catalogs:', error);
        toast.error(
          'An error occurred while reordering footer catalogs. Please try again.',
        );
        await fetchAll();
      }
    },
    [catalogs, fetchAll],
  );

  return {
    catalogs,
    isLoading,
    setCatalogs,
    fetchAll,
    createOrUpdate,
    remove,
    toggleStatus,
    reorder,
  };
}
