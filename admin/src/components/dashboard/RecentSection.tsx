'use client';

import RecentActivity from '@/components/dashboard/RecentActivity';
import RecentOrders from '@/components/dashboard/RecentOrders';

function RecentSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RecentOrders limit={5} showRefresh />
      <RecentActivity limit={10} showRefresh autoRefresh />
    </div>
  );
}

export default RecentSection;
