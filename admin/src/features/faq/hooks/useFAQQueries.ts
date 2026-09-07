'use client';

import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { clientLogger } from '@/lib/logger';
import { authHeaders } from '@/utils/authHeaders';
import type { FAQItem } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export function useFAQs() {
  const [faqs, setFAQs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFAQs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/faqs`, { credentials: 'include', headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setFAQs(data.data || []);
      } else {
        toast.error('Failed to fetch FAQs');
      }
    } catch (error) {
      clientLogger.error('Error fetching FAQs:', error);
      toast.error('An error occurred while fetching FAQs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { faqs, isLoading, fetchFAQs, setFAQs };
}

export function useCreateFAQ() {
  const [isCreating, setIsCreating] = useState(false);

  const create = useCallback(async (payload: Partial<FAQItem>): Promise<FAQItem | null> => {
    setIsCreating(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/faqs`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success('FAQ created successfully');
        return data.data as FAQItem;
      }
      const err = await res.json();
      toast.error(err.message || 'Failed to create FAQ');
      return null;
    } catch (error) {
      clientLogger.error('Error creating FAQ:', error);
      toast.error('An error occurred while creating the FAQ');
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return { create, isCreating };
}

export function useUpdateFAQ() {
  const [isUpdating, setIsUpdating] = useState(false);

  const update = useCallback(async (id: string, payload: Partial<FAQItem>): Promise<FAQItem | null> => {
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/faqs/${id}`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success('FAQ updated successfully');
        return data.data as FAQItem;
      }
      const err = await res.json();
      toast.error(err.message || 'Failed to update FAQ');
      return null;
    } catch (error) {
      clientLogger.error('Error updating FAQ:', error);
      toast.error('An error occurred while updating the FAQ');
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return { update, isUpdating };
}

export function useDeleteFAQ() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteFAQ = useCallback(async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/faqs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: authHeaders(),
      });
      if (res.ok) {
        toast.success('FAQ deleted successfully');
        return true;
      }
      toast.error('Failed to delete FAQ');
      return false;
    } catch (error) {
      clientLogger.error('Error deleting FAQ:', error);
      toast.error('An error occurred while deleting the FAQ');
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return { deleteFAQ, isDeleting };
}

export function useToggleFAQ() {
  const [isToggling, setIsToggling] = useState(false);

  const toggle = useCallback(async (id: string): Promise<FAQItem | null> => {
    setIsToggling(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/faqs/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(`FAQ ${data.data.isActive ? 'activated' : 'deactivated'} successfully`);
        return data.data as FAQItem;
      }
      toast.error('Failed to toggle FAQ status');
      return null;
    } catch (error) {
      clientLogger.error('Error toggling FAQ:', error);
      toast.error('An error occurred while toggling FAQ status');
      return null;
    } finally {
      setIsToggling(false);
    }
  }, []);

  return { toggle, isToggling };
}
