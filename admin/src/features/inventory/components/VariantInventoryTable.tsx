'use client';

import type { VariantInventoryRow } from '../types';

interface VariantInventoryTableProps {
  variants: VariantInventoryRow[];
  onUpdateStock: (variantId: string, changeType: 'STOCK_ADDED' | 'STOCK_DEDUCTED') => void;
}

function variantLabel(v: VariantInventoryRow): string {
  const parts = [v.color, v.size, v.pattern].filter(Boolean);
  if (parts.length > 0) return parts.join(' / ');
  return v.sku || 'Default';
}

function statusOf(v: VariantInventoryRow): { label: string; className: string } {
  if (v.quantity < 1) {
    return { label: 'Out of Stock', className: 'bg-red-100 text-red-700' };
  }
  if (v.quantity <= v.lowStockThreshold) {
    return { label: 'Low Stock', className: 'bg-amber-100 text-amber-700' };
  }
  return { label: 'In Stock', className: 'bg-green-100 text-green-700' };
}

export default function VariantInventoryTable({
  variants,
  onUpdateStock,
}: VariantInventoryTableProps) {
  if (variants.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-black mb-6">Variant Stock</h2>
        <p className="text-sm text-gray-500">No product variants found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-black mb-6">Variant Stock</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-black border-b border-gray-200">
              <th className="py-3 pr-4 font-medium">Product</th>
              <th className="py-3 pr-4 font-medium">Variant</th>
              <th className="py-3 pr-4 font-medium">SKU</th>
              <th className="py-3 pr-4 font-medium">Stock</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => {
              const status = statusOf(v);
              return (
                <tr key={v.variantId} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 pr-4 text-black font-medium">{v.productName}</td>
                  <td className="py-3 pr-4 text-black">{variantLabel(v)}</td>
                  <td className="py-3 pr-4 text-black font-mono text-xs">{v.sku || '—'}</td>
                  <td
                    className={`py-3 pr-4 font-mono text-black ${
                      v.quantity < 1
                        ? 'text-red-600'
                        : v.quantity <= v.lowStockThreshold
                          ? 'text-amber-600'
                          : ''
                    }`}
                  >
                    {v.quantity}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => onUpdateStock(v.variantId, 'STOCK_ADDED')}
                      className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-200 mr-2"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => onUpdateStock(v.variantId, 'STOCK_DEDUCTED')}
                      className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-200"
                    >
                      -1
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
