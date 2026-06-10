'use client';

import { AlertTriangle, Box, Package, TrendingDown } from 'lucide-react';
import type { InventoryStats as InventoryStatsType } from '../types';

const statIcons = {
  total: Box,
  stock: Package,
  low: AlertTriangle,
  out: TrendingDown,
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: keyof typeof statIcons;
  accent: string;
}

const iconBg: Record<string, string> = {
  total: 'bg-gray-100',
  stock: 'bg-blue-50',
  low: 'bg-amber-50',
  out: 'bg-red-50',
};

const iconColor: Record<string, string> = {
  total: 'text-gray-600',
  stock: 'text-blue-600',
  low: 'text-amber-600',
  out: 'text-red-600',
};

function StatCard({ label, value, icon, accent }: StatCardProps) {
  const Icon = statIcons[icon];
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${iconBg[icon]}`}>
          <Icon className={`w-5 h-5 ${iconColor[icon]}`} />
        </div>
      </div>
      <div className="text-3xl font-bold text-black mb-1">{value}</div>
      <div className="text-sm font-medium text-black">{label}</div>
    </div>
  );
}

interface InventoryStatsProps {
  stats: InventoryStatsType | null;
}

export default function InventoryStats({ stats }: InventoryStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Total Products" value={stats?.totalProducts || 0} icon="total" accent="gray" />
      <StatCard label="Total Stock" value={stats?.totalStock || 0} icon="stock" accent="blue" />
      <StatCard label="Low Stock" value={stats?.lowStockCount || 0} icon="low" accent="amber" />
      <StatCard label="Out of Stock" value={stats?.outOfStockCount || 0} icon="out" accent="red" />
    </div>
  );
}
