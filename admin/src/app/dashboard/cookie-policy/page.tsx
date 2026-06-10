'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function CookiePolicyPage() {
  return (
    <DashboardLayout title="Cookie Policy">
      <div className="space-y-8">
        <div className="rounded-xl p-8">
          <h1 className="text-3xl font-bold text-black">Cookie Policy</h1>
          <p className="text-black mt-2 opacity-75">
            Manage your cookie policy settings
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <p className="text-black">Cookie policy content goes here.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
