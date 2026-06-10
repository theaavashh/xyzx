'use client';

import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { useSalesOverview } from '@/hooks/useDashboardData';

function KPICards() {
  const { data: salesOverview, isLoading: isSalesLoading, error: salesError } = useSalesOverview();

  const isLoading = isSalesLoading;

  const formatCurrency = (amount: number) => {
    return `A$ ${amount.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {['revenue', 'orders', 'customers', 'conversion'].map((key) => (
          <div
            key={key}
            className="bg-white p-6 rounded-xl animate-pulse h-32 border border-gray-100 shadow-sm"
          />
        ))}
      </div>
    );
  }

  if (salesError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
        <p className="text-red-600 font-semibold">Failed to load dashboard stats</p>
        <p className="text-red-500 text-sm mt-1">{(salesError as Error).message}</p>
      </div>
    );
  }

  const totalRevenue = salesOverview?.totalRevenue || 0;
  const totalOrders = salesOverview?.totalOrders || 0;
  const avgOrderValue = salesOverview?.avgOrderValue || 0;
  const totalCustomers = salesOverview?.totalCustomers || 0;
  const conversionRate = salesOverview?.conversionRate || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        subtitle="Last 7 days"
        icon={DollarSign}
        iconColor="text-[#D4AF37]"
        iconBgColor="bg-amber-50"
      />
      <StatCard
        title="Total Orders"
        value={totalOrders.toLocaleString()}
        subtitle={`Avg ${formatCurrency(avgOrderValue)}`}
        icon={ShoppingCart}
        iconColor="text-[#D4AF37]"
        iconBgColor="bg-amber-50"
      />
      <StatCard
        title="Total Customers"
        value={totalCustomers.toLocaleString()}
        subtitle="Active buyers"
        icon={Users}
        iconColor="text-[#D4AF37]"
        iconBgColor="bg-amber-50"
      />
      <StatCard
        title="Conversion Rate"
        value={`${conversionRate.toFixed(1)}%`}
        subtitle="Orders to visitors"
        icon={TrendingUp}
        iconColor="text-[#D4AF37]"
        iconBgColor="bg-amber-50"
      />
    </div>
  );
}

export default KPICards;
