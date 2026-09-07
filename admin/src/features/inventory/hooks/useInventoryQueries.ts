'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiWrapper as api } from '@/services/apiClient';
import toast from 'react-hot-toast';
import { clientLogger } from '@/lib/logger';
import type { InventoryStats, InventoryLogEntry, LowStockProduct, VariantInventoryRow } from '../types';

export function useInventoryQueries() {
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [logs, setLogs] = useState<InventoryLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [updateType, setUpdateType] = useState('STOCK_ADJUSTED');
  const [updateReason, setUpdateReason] = useState('');
  const [variantInventory, setVariantInventory] = useState<VariantInventoryRow[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, lowStockRes, logsRes] = await Promise.all([
        api.get<{ success: boolean; data: InventoryStats }>('/api/v1/inventory/stats'),
        api.get<{ success: boolean; data: { products: LowStockProduct[]; count: number } }>('/api/v1/inventory/low-stock'),
        api.get<{ success: boolean; data: { logs: InventoryLogEntry[]; total: number } }>('/api/v1/inventory/logs?limit=20'),
      ]);
      setStats(statsRes.data);
      setLowStock(lowStockRes.data.products);
      setLogs(logsRes.data.logs);
    } catch (error) {
      clientLogger.error('Failed to fetch inventory data', error);
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fetchVariantInventory = useCallback(async () => {
    try {
      const res = await api.get<{ success: boolean; data: { variants: VariantInventoryRow[]; count: number } }>(
        '/api/v1/inventory/variants',
      );
      setVariantInventory(res.data.variants);
    } catch (error) {
      clientLogger.error('Failed to fetch variant inventory', error);
      toast.error('Failed to load variant inventory');
    }
  }, []);

  useEffect(() => { fetchVariantInventory(); }, [fetchVariantInventory]);

  const handleUpdateVariantStock = async (variantId: string, changeType: 'STOCK_ADDED' | 'STOCK_DEDUCTED') => {
    try {
      await api.put(`/api/v1/inventory/variant/${variantId}`, {
        quantity: 1,
        changeType,
        reason: changeType === 'STOCK_ADDED' ? 'Restock +1' : 'Sale -1',
      });
      toast.success('Variant stock updated');
      fetchVariantInventory();
    } catch {
      toast.error('Failed to update variant stock');
    }
  };

  const handleUpdateStock = async () => {
    if (!selectedProduct) {
      toast.error('Product ID is required');
      return;
    }

    try {
      await api.put(`/api/v1/inventory/${selectedProduct}`, {
        quantity: 1,
        changeType: updateType,
        reason: updateReason || 'Manual adjustment',
      });
      toast.success('Stock updated');
      setSelectedProduct('');
      setUpdateReason('');
      fetchData();
    } catch {
      toast.error('Failed to update stock');
    }
  };

  const handleStoreSale = async () => {
    if (!selectedProduct) {
      toast.error('Product ID is required');
      return;
    }

    try {
      await api.post('/api/v1/inventory/store-sale', {
        items: [{ productId: selectedProduct, quantity: 1 }],
        saleId: `store_${Date.now()}`,
      });
      toast.success('Store sale deducted');
      setSelectedProduct('');
      fetchData();
    } catch {
      toast.error('Failed to process store sale');
    }
  };

  return {
    stats,
    lowStock,
    logs,
    loading,
    selectedProduct,
    setSelectedProduct,
    updateType,
    setUpdateType,
    updateReason,
    setUpdateReason,
    handleUpdateStock,
    handleStoreSale,
    variantInventory,
    handleUpdateVariantStock,
    fetchData,
  };
}
