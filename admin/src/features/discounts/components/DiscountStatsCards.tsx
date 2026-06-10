'use client';

import { Clock, Percent, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import type { CouponStats } from '../types';

interface DiscountStatsCardsProps {
  stats?: CouponStats;
}

export function DiscountStatsCards({ stats }: DiscountStatsCardsProps) {
  const cards = [
    {
      label: 'Total Coupons',
      value: stats?.totalCoupons ?? 0,
      sub: `${stats?.activeCoupons ?? 0} active`,
      icon: Tag,
      bg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Discounts',
      value: stats?.totalDiscounts ?? 0,
      sub: 'Times used',
      icon: Percent,
      bg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Expiring Soon',
      value: stats?.expiringSoon ?? 0,
      sub: 'In next 7 days',
      icon: Clock,
      bg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm text-gray-500">{card.sub}</p>
                </div>
                <div className={`${card.bg} p-3 rounded-full`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
