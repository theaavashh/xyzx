'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { clientLogger } from '@/lib/logger';
import type { ShippingItem, ShippingSettings } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export function useShippingItems(type?: string) {
  const [items, setItems] = useState<ShippingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = type ? `?type=${type}` : '';
      const res = await fetch(`${API_BASE}/api/v1/shipping${params}`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setItems(data.data || []);
      }
    } catch (error) {
      clientLogger.error('Error fetching shipping items:', error);
      toast.error('Failed to load shipping items');
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  return { items, isLoading, refetch: fetchItems, setItems };
}

export function useCreateShippingItem() {
  const [isCreating, setIsCreating] = useState(false);

  const create = async (payload: Partial<ShippingItem>): Promise<ShippingItem | null> => {
    setIsCreating(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/shipping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success('Shipping item created');
        return data.data;
      }
      const err = await res.json();
      toast.error(err.message || 'Failed to create');
      return null;
    } catch (error) {
      clientLogger.error('Error creating shipping item:', error);
      toast.error('Failed to create shipping item');
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return { create, isCreating };
}

export function useUpdateShippingItem() {
  const [isUpdating, setIsUpdating] = useState(false);

  const update = async (id: string, payload: Partial<ShippingItem>): Promise<ShippingItem | null> => {
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/shipping/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success('Shipping item updated');
        return data.data;
      }
      const err = await res.json();
      toast.error(err.message || 'Failed to update');
      return null;
    } catch (error) {
      clientLogger.error('Error updating shipping item:', error);
      toast.error('Failed to update shipping item');
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  return { update, isUpdating };
}

export function useDeleteShippingItem() {
  const [isDeleting, setIsDeleting] = useState(false);

  const remove = async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/shipping/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Shipping item deleted');
        return true;
      }
      toast.error('Failed to delete');
      return false;
    } catch (error) {
      clientLogger.error('Error deleting shipping item:', error);
      toast.error('Failed to delete shipping item');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { remove, isDeleting };
}

export function useToggleShippingItem() {
  const [isToggling, setIsToggling] = useState(false);

  const toggle = async (id: string): Promise<ShippingItem | null> => {
    setIsToggling(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/shipping/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
      toast.error('Failed to toggle');
      return null;
    } catch (error) {
      clientLogger.error('Error toggling shipping item:', error);
      toast.error('Failed to toggle shipping item');
      return null;
    } finally {
      setIsToggling(false);
    }
  };

  return { toggle, isToggling };
}

export function useShippingSettings() {
  const [settings, setSettings] = useState<ShippingSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/shipping/settings`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (mounted) setSettings(data.data);
        }
      } catch (error) {
        clientLogger.error('Error fetching shipping settings:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return { settings, setSettings, isLoading };
}

export function useUpdateShippingSettings() {
  const [isSaving, setIsSaving] = useState(false);

  const save = async (payload: Partial<ShippingSettings>): Promise<ShippingSettings | null> => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/shipping/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success('Settings updated');
        return data.data;
      }
      toast.error('Failed to update settings');
      return null;
    } catch {
      toast.error('Failed to update shipping settings');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return { save, isSaving };
}
