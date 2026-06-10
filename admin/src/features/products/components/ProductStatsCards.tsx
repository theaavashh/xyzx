'use client';

import { AlertTriangle, CheckCircle, EyeOff, Package } from 'lucide-react';

interface ProductStatsCardsProps {
  total: number;
  active: number;
  inactive: number;
  lowStock: number;
}

export default function ProductStatsCards({ total, active, inactive, lowStock }: ProductStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="rounded-lg bg-white p-5 ring-1 ring-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-gray-100">
            <Package className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-semibold text-gray-900">{total}</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-white p-5 ring-1 ring-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-xl font-semibold text-emerald-600">{active}</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-white p-5 ring-1 ring-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-gray-50">
            <EyeOff className="w-4 h-4 text-gray-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Inactive</p>
            <p className="text-xl font-semibold text-gray-600">{inactive}</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-white p-5 ring-1 ring-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-50">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Low Stock</p>
            <p className="text-xl font-semibold text-amber-600">{lowStock}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
