'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import KPICards from '@/components/dashboard/KPICards';
import RecentSection from '@/components/dashboard/RecentSection';
import TrafficAndProducts from '@/components/dashboard/TrafficAndProducts';
import { FastMovingCategories } from '@/components/dashboard/FastMovingCategories';
import { Shortcuts } from '@/components/dashboard/Shortcuts';

const SalesCharts = dynamic(() => import('@/components/dashboard/SalesCharts'), { ssr: false });

function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-black outer-sans">Dashboard</h2>
          <p className="text-black text-lg mt-2 saans">Welcome back! Here&apos;s what&apos;s happening with your store today.</p>
        </div>
      </div>

      <KPICards />

      <Shortcuts />

      <FastMovingCategories />

      <SalesCharts />

      <TrafficAndProducts />

      <RecentSection />
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardLayout>
          <DashboardContent />
        </DashboardLayout>
      </Suspense>
    </ProtectedRoute>
  );
}
