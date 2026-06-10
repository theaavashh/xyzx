'use client';

import { Package } from 'lucide-react';

export default function OrdersList() {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-lg border border-gray-200">
      <div className="bg-blue-50 p-6 rounded-full mb-6">
        <Package className="w-12 h-12 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        COMING SOON
      </h2>
      <p className="text-gray-600 text-center max-w-md">
        Order management is currently under development. This feature will allow you to view, track, and manage all customer orders from a single dashboard.
      </p>
      <div className="mt-6 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-500">
        Expected release: Q2 2026
      </div>
    </div>
  );
}
