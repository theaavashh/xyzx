'use client';

import { TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { useCategoryPerformance } from '@/hooks/useDashboardData';
import type { CategoryPerformance } from '@/hooks/useDashboardData';

const turnoverColors: Record<string, string> = {
  'Very High': 'bg-red-100 text-red-700',
  'High': 'bg-orange-100 text-orange-700',
  'Medium': 'bg-yellow-100 text-yellow-700',
  'Low': 'bg-blue-100 text-blue-700',
  'Very Low': 'bg-gray-100 text-gray-600',
};

const barColors = [
  'bg-gradient-to-r from-[#D4AF37] to-amber-400',
  'bg-gradient-to-r from-amber-500 to-amber-400',
  'bg-gradient-to-r from-amber-400 to-amber-300',
  'bg-gradient-to-r from-[#c9a32e] to-amber-400',
  'bg-gradient-to-r from-amber-300 to-amber-200',
  'bg-gradient-to-r from-gray-300 to-gray-200',
  'bg-gradient-to-r from-gray-200 to-gray-100',
  'bg-gradient-to-r from-gray-200 to-gray-100',
];

function CategoryRow({ item, maxSold, index }: { item: CategoryPerformance; maxSold: number; index: number }) {
  const width = (item.itemsSold / maxSold) * 100;
  const isPositive = item.growth >= 0;

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-black truncate">{item.category}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${turnoverColors[item.turnover] || turnoverColors['Low']}`}>
            {item.turnover}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm text-gray-500">{item.itemsSold} sold</span>
          <span className={`text-xs font-medium flex items-center gap-0.5 ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(item.growth)}%
          </span>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColors[index] || barColors[barColors.length - 1]}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export function FastMovingCategories() {
  const { data, isLoading, isError } = useCategoryPerformance();
  const categories = Array.isArray(data) ? data : [];
  const maxSold = categories.length > 0 ? Math.max(...categories.map((c) => c.itemsSold)) : 1;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="text-lg font-bold text-black lastik uppercase tracking-wide">Category Movement</h3>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex justify-between mb-1">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
                <div className="h-2 bg-gray-100 rounded-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-gray-500 text-center py-4">Unable to load category data</p>
        ) : (
          <div className="space-y-4">
            {categories
              .sort((a, b) => b.itemsSold - a.itemsSold)
              .map((item, i) => (
                <CategoryRow key={item.category} item={item} maxSold={maxSold} index={i} />
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
