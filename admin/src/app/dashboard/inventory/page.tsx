'use client';

import { useInventoryQueries } from '@/features/inventory';
import InventoryStats from '@/features/inventory/components/InventoryStats';
import InventoryFilters from '@/features/inventory/components/InventoryFilters';
import InventoryTable from '@/features/inventory/components/InventoryTable';
import VariantInventoryTable from '@/features/inventory/components/VariantInventoryTable';
import DashboardLayout from '@/components/DashboardLayout';

export default function InventoryPage() {
  const {
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
  } = useInventoryQueries();

  if (loading) {
    return (
      <DashboardLayout title="Inventory">
        <div className="p-8 text-center text-gray-500">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Inventory Management">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Inventory</h1>
          <p className="text-black text-lg mt-2">Manage stock levels and track inventory changes</p>
        </div>

        <InventoryStats stats={stats} />

        <InventoryFilters
          selectedProduct={selectedProduct}
          onSelectedProductChange={setSelectedProduct}
          updateType={updateType}
          onUpdateTypeChange={setUpdateType}
          updateReason={updateReason}
          onUpdateReasonChange={setUpdateReason}
          onUpdateStock={handleUpdateStock}
          onStoreSale={handleStoreSale}
        />

        <InventoryTable lowStock={lowStock} logs={logs} />
      </div>

      <div className="space-y-6">
        <VariantInventoryTable variants={variantInventory} onUpdateStock={handleUpdateVariantStock} />
      </div>
    </DashboardLayout>
  );
}
