import { useCallback, useState } from 'react';
import { apiWrapper as api } from '@/services/apiClient';
import toast from 'react-hot-toast';
import type { Product, SaleRecord, ListResponse, SaleDetailResponse, CreateSaleResponse } from '../types';

export function usePosQueries() {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const normalizeProducts = (body: unknown): Product[] => {
    if (Array.isArray(body)) return body;
    if (body && typeof body === 'object') {
      const obj = body as Record<string, unknown>;
      if (Array.isArray(obj.data)) return obj.data as Product[];
      if (obj.data && typeof obj.data === 'object' && Array.isArray((obj.data as Record<string, unknown>).products)) {
        return (obj.data as Record<string, unknown>).products as Product[];
      }
      if (Array.isArray(obj.products)) return obj.products as Product[];
    }
    console.error('[POS] Unexpected API response shape:', body);
    return [];
  };

  const fetchProducts = useCallback(async (searchQuery: string): Promise<Product[]> => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { limit: 50, isActive: true };
      if (searchQuery) params.search = searchQuery;
      const res = await api.get<unknown>('/api/v1/products', { params });
      return normalizeProducts(res);
    } catch (err) {
      console.error('[POS] Failed to fetch products:', err);
      toast.error('Failed to load products');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSalesHistory = useCallback(async (historyPage: number, historySearch: string): Promise<{ data: SaleRecord[] }> => {
    try {
      const params: Record<string, unknown> = { page: historyPage, limit: 20 };
      if (historySearch) params.search = historySearch;
      const res = await api.get<ListResponse>('/api/v1/pos/sales', { params });
      return { data: res.data.data };
    } catch {
      toast.error('Failed to load sales history');
      return { data: [] };
    }
  }, []);

  const createSale = useCallback(async (payload: Record<string, unknown>): Promise<SaleRecord | null> => {
    setProcessing(true);
    try {
      const res = await api.post<CreateSaleResponse>('/api/v1/pos/sales', payload);
      return res.data;
    } catch {
      toast.error('Failed to process sale');
      return null;
    } finally {
      setProcessing(false);
    }
  }, []);

  const getSaleDetail = useCallback(async (saleId: string): Promise<SaleRecord | null> => {
    try {
      const res = await api.get<SaleDetailResponse>(`/api/v1/pos/sales/${saleId}`);
      return res.data;
    } catch {
      toast.error('Failed to load sale for reprint');
      return null;
    }
  }, []);

  return { loading, setLoading, processing, setProcessing, fetchProducts, fetchSalesHistory, createSale, getSaleDetail };
}
