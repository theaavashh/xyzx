import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { clientLogger } from '@/lib/logger';
import { authHeaders } from '@/utils/authHeaders';
import type { ContentPage } from '../types';

export function useContentPagesQueries() {
  const [isLoading, setIsLoading] = useState(false);

  const fetchPages = useCallback(async (): Promise<ContentPage[]> => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/content`,
        { credentials: 'include', headers: authHeaders() },
      );
      if (response.ok) {
        const data = await response.json();
        return data.data || [];
      }
      toast.error('Failed to fetch content pages');
      return [];
    } catch (error) {
      clientLogger.error('Error fetching content pages:', error);
      toast.error('An error occurred while fetching content pages');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePage = useCallback(async (slug: string, form: Partial<ContentPage>): Promise<boolean> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/content/slug/${slug}`,
        {
          method: 'PUT',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          credentials: 'include',
          body: JSON.stringify(form),
        },
      );
      if (response.ok) {
        toast.success('Content page updated successfully');
        return true;
      }
      const errorData = await response.json();
      toast.error(errorData.message || 'Failed to update content page');
      return false;
    } catch (error) {
      clientLogger.error('Error updating content page:', error);
      toast.error('An error occurred while updating the content page');
      return false;
    }
  }, []);

  const createPage = useCallback(async (createForm: Record<string, string>): Promise<boolean> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/content`,
        {
          method: 'POST',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          credentials: 'include',
          body: JSON.stringify(createForm),
        },
      );
      if (response.ok) {
        toast.success('Content page created successfully');
        return true;
      }
      const errorData = await response.json();
      toast.error(errorData.message || 'Failed to create content page');
      return false;
    } catch (error) {
      clientLogger.error('Error creating content page:', error);
      toast.error('An error occurred while creating the content page');
      return false;
    }
  }, []);

  const deletePage = useCallback(async (slug: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/content/slug/${slug}`,
        { method: 'DELETE', credentials: 'include', headers: authHeaders() },
      );
      if (response.ok) {
        toast.success('Content page deleted successfully');
        return true;
      }
      toast.error('Failed to delete content page');
      return false;
    } catch (error) {
      clientLogger.error('Error deleting content page:', error);
      toast.error('An error occurred while deleting the content page');
      return false;
    }
  }, []);

  const togglePageStatus = useCallback(async (slug: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/content/slug/${slug}/toggle`,
        { method: 'PATCH', credentials: 'include', headers: authHeaders() },
      );
      if (response.ok) {
        const data = await response.json();
        toast.success(`Content page ${data.data.isActive ? 'activated' : 'deactivated'} successfully`);
        return true;
      }
      toast.error('Failed to toggle content page status');
      return false;
    } catch (error) {
      clientLogger.error('Error toggling content page status:', error);
      toast.error('An error occurred while toggling the content page status');
      return false;
    }
  }, []);

  return { isLoading, fetchPages, updatePage, createPage, deletePage, togglePageStatus };
}
