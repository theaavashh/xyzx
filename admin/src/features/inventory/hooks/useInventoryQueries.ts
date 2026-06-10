'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiWrapper as api } from '@/services/apiClient';
import toast from 'react-hot-toast';
import { clientLogger } from '@/lib/logger';
import type { InventoryStats, InventoryLogEntry, LowStockProduct } from '../types';

export function useInventoryQueries() {
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [logs, setLogs] = useState<InventoryLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [updateQty, setUpdateQty] = useState('');
  const [updateType, setUpdateType] = useState('STOCK_ADJUSTED');
  const [updateReason, setUpdateReason] = useState('');

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

  const handleUpdateStock = async () => {
    if (!selectedProduct || !updateQty) {
      toast.error('Product ID and quantity are required');
      return;
    }

    try {
      await api.put(`/api/v1/inventory/${selectedProduct}`, {
        quantity: Number(updateQty),
        changeType: updateType,
        reason: updateReason || 'Manual adjustment',
      });
      toast.success('Stock updated');
      setSelectedProduct('');
      setUpdateQty('');
      setUpdateReason('');
      fetchData();
    } catch {
      toast.error('Failed to update stock');
    }
  };

  const handleStoreSale = async () => {
    if (!selectedProduct || !updateQty) {
      toast.error('Product ID and quantity are required');
      return;
    }

    try {
      await api.post('/api/v1/inventory/store-sale', {
        items: [{ productId: selectedProduct, quantity: Number(updateQty) }],
        saleId: `store_${Date.now()}`,
      });
      toast.success('Store sale deducted');
      setSelectedProduct('');
      setUpdateQty('');
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
    updateQty,
    setUpdateQty,
    updateType,
    setUpdateType,
    updateReason,
    setUpdateReason,
    handleUpdateStock,
    handleStoreSale,
    fetchData,
  };
}
