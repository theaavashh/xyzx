'use client';

import { AlertTriangle, CheckCircle, EyeOff, Package } from 'lucide-react';

interface ProductStatsCardsProps {
  total: number;
  active: number;
  inactive: number;
  lowStock: number;
}

const cards = [
  { label: 'Total', value: (v: number) => v, icon: Package, color: 'gray' },
  { label: 'Active', value: (v: number) => v, icon: CheckCircle, color: 'emerald' },
  { label: 'Inactive', value: (v: number) => v, icon: EyeOff, color: 'gray' },
  { label: 'Low Stock', value: (v: number) => v, icon: AlertTriangle, color: 'amber' },
];

const colorMap: Record<string, { bg: string; text: string; icon: string; iconBg: string }> = {
  gray: { bg: 'bg-gray-100', text: 'text-gray-900', icon: 'text-gray-600', iconBg: 'bg-gray-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'text-emerald-600', iconBg: 'bg-emerald-50' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'text-amber-600', iconBg: 'bg-amber-50' },
};

export default function ProductStatsCards({ total, active, inactive, lowStock }: ProductStatsCardsProps) {
  const values = { total, active, inactive, lowStock };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const clr = colorMap[c.color];
        const Icon = c.icon;
        return (
          <div key={c.label} className="rounded-xl bg-white p-5 ring-1 ring-gray-200 hover:ring-[#D4AF37]/20 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${clr.iconBg}`}>
                <Icon className={`w-4 h-4 ${clr.icon}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{c.label}</p>
                <p className={`text-2xl ${clr.text}`}>{c.value(values[c.label as keyof typeof values])}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
