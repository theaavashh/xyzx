'use client';

import { clientLogger } from '@/lib/logger';
import { authHeaders } from '@/utils/authHeaders';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { SalesBanner, SalesBannerFormData } from '../types';

const SALES_BANNERS_KEY = ['sales-banners'];
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function handleResponse(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function useSalesBanners() {
  return useQuery({
    queryKey: SALES_BANNERS_KEY,
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/api/v1/sales-banners`, { credentials: 'include', headers: authHeaders() });
      if (!res.ok) throw new Error('Failed to fetch sales banners');
      const data = await res.json();
      return (data.data || []) as SalesBanner[];
    },
  });
}

export function useCreateSalesBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (form: SalesBannerFormData) => {
      const res = await fetch(`${BASE_URL}/api/v1/sales-banners`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify(form),
      });
      return handleResponse(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SALES_BANNERS_KEY });
      toast.success('Sales banner created successfully');
    },
    onError: (error: Error) => {
      clientLogger.error('Error creating sales banner:', error);
      toast.error(error.message);
    },
  });
}

export function useUpdateSalesBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, form }: { id: string; form: SalesBannerFormData }) => {
      const res = await fetch(`${BASE_URL}/api/v1/sales-banners/${id}`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify(form),
      });
      return handleResponse(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SALES_BANNERS_KEY });
      toast.success('Sales banner updated successfully');
    },
    onError: (error: Error) => {
      clientLogger.error('Error updating sales banner:', error);
      toast.error(error.message);
    },
  });
}

export function useDeleteSalesBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE_URL}/api/v1/sales-banners/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: authHeaders(),
      });
      return handleResponse(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SALES_BANNERS_KEY });
      toast.success('Sales banner deleted successfully');
    },
    onError: (error: Error) => {
      clientLogger.error('Error deleting sales banner:', error);
      toast.error(error.message);
    },
  });
}

export function useToggleSalesBannerStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (banner: SalesBanner) => {
      const res = await fetch(`${BASE_URL}/api/v1/sales-banners/${banner.id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
        headers: authHeaders(),
      });
      const data = await handleResponse(res);
      return data.data as { isActive: boolean };
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: SALES_BANNERS_KEY });
      toast.success(`Sales banner ${data.isActive ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (error: Error) => {
      clientLogger.error('Error toggling sales banner status:', error);
      toast.error(error.message);
    },
  });
}

export function useReorderSalesBanners() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orders: { id: string; order: number }[]) => {
      const res = await fetch(`${BASE_URL}/api/v1/sales-banners/reorder`, {
        method: 'PATCH',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify({ orders }),
      });
      return handleResponse(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SALES_BANNERS_KEY });
      toast.success('Sales banners reordered successfully');
    },
    onError: (error: Error) => {
      clientLogger.error('Error reordering sales banners:', error);
      toast.error(error.message);
    },
  });
}

export function useUploadSalesBannerImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${BASE_URL}/api/v1/upload/sales-banner`, {
        method: 'POST',
        credentials: 'include',
        headers: authHeaders(),
        body: formData,
      });
      const data = await handleResponse(res);
      const imageUrl = (data.data?.url as string) || (data.url as string);
      if (!imageUrl) throw new Error('Failed to get image URL from upload response');
      return imageUrl;
    },
    onSuccess: () => {
      toast.success('Image uploaded successfully');
    },
    onError: (error: Error) => {
      clientLogger.error('Error uploading image:', error);
      toast.error(error.message);
    },
  });
}
