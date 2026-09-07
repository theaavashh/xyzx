'use client';

import { RotateCcw, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ErrorState } from '@/components/dashboard/ErrorState';

export default function ReturnsPage() {
  // Placeholder data
  const returns = [];
  const isLoading = false;
  const error = null;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded" />
        <div className="bg-gray-100 rounded-xl h-64" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Unable to load returns." onRetry={() => {}} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`swansea text-4xl font-medium text-zinc-600 uppercase`}>My Returns</h1>
          <p className="text-base text-zinc-600 mt-1">Track and manage your returns</p>
        </div>
      </div>

      {returns.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <RotateCcw className="h-8 w-8 text-zinc-600" />
          </div>
          <h3 className="text-xl font-medium text-zinc-600 mb-2">No returns yet</h3>
          <p className="text-base text-zinc-600 mb-8">You haven&apos;t initiated any returns.</p>
          <Link href="/dashboard/orders" className="inline-flex items-center px-8 py-3 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#C4A030] transition-colors">
            View My Orders
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-50">
          {/* Returns list will go here */}
        </div>
      )}
    </div>
  );
}
