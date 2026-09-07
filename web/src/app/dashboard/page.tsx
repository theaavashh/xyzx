'use client';

import { Package, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useOrders } from '@/lib/dashboard/hooks';

export default function DashboardPage() {
  const { data: ordersData, isLoading: ordersLoading } = useOrders({ limit: 10 });
  const latestOrders = useMemo(() => ordersData?.data ?? [], [ordersData?.data]);

  if (ordersLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 animate-pulse space-y-12">
        <div className="h-8 bg-gray-50 rounded w-64" />
        <div className="h-px bg-gray-100" />
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 bg-gray-50 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      <div className="h-px bg-gray-100" />

      {/* Orders */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-medium text-zinc-600 uppercase tracking-wider">Your Orders</h2>
          <Link href="/dashboard/orders" className="text-sm text-zinc-600 uppercase tracking-wider hover:text-zinc-600 transition-colors">
            View All
          </Link>
        </div>

        {latestOrders.length === 0 ? (
          <div className="border border-gray-100 p-16 text-center">
            <ShoppingBag className="h-8 w-8 text-zinc-600 mx-auto mb-4" />
            <p className="text-base text-zinc-600 mb-6">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/products"
              className="inline-block bg-black text-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {latestOrders.map((order) => (
              <Link
                key={order.id}
                href="/dashboard/orders"
                className="flex items-center gap-6 py-6 group"
              >
                <div className="w-14 h-14 bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Package className="h-5 w-5 text-zinc-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-zinc-600 tracking-wide">Order #{order.orderNumber}</p>
                  <p className="text-sm text-zinc-600 mt-1">
                    {order.itemCount} item{order.itemCount > 1 ? 's' : ''} &middot; {new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-base font-medium text-zinc-600 tracking-wide">${order.total.toFixed(2)}</p>
                  <span className="text-xs text-zinc-600 uppercase tracking-wider">{order.status}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-600 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}