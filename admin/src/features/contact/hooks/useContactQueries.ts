'use client';

import { authHeaders } from '@/utils/authHeaders';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { ContactSubmission } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export function useContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/contact/submissions`, {
        credentials: 'include',
        headers: authHeaders(),
      });
      if (response.ok) {
        const result = await response.json();
        setSubmissions(Array.isArray(result.data) ? result.data : []);
      } else {
        toast.error('Failed to load contact submissions');
      }
    } catch {
      toast.error('Failed to load contact submissions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { submissions, isLoading, refetch: load };
}

export function useDeleteSubmission() {
  const [isDeleting, setIsDeleting] = useState(false);

  const remove = async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/contact/submissions/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: authHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to delete submission');
      }

      toast.success('Submission deleted successfully');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete submission';
      toast.error(message);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { remove, isDeleting };
}

export function useMarkAsRead() {
  const [isMarking, setIsMarking] = useState(false);

  const markAsRead = async (id: string): Promise<boolean> => {
    setIsMarking(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/contact/submissions/${id}/read`, {
        method: 'PATCH',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to mark as read');
      }

      toast.success('Marked as read');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to mark as read';
      toast.error(message);
      return false;
    } finally {
      setIsMarking(false);
    }
  };

  return { markAsRead, isMarking };
}
