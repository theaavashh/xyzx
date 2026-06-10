'use client';

import { Package, Search, ChevronRight, Clock, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useOrders } from '@/lib/dashboard/hooks';
import type { Order } from '@/lib/dashboard/types';
import { ErrorState } from '@/components/dashboard/ErrorState';

const STATUS_CONFIG = {
  pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Pending' },
  processing: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Processing' },
  shipped: { icon: Package, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Shipped' },
  delivered: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Cancelled' },
  returned: { icon: RotateCcw, color: 'text-gray-600', bg: 'bg-gray-50', label: 'Returned' },
};

function OrderSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
      {[0, 1].map((i) => (
        <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const { data: ordersData, isLoading, error, refetch } = useOrders();

  if (isLoading) {
    return <OrderSkeleton />;
  }

  if (error) {
    return <ErrorState message="Unable to load your orders." onRetry={() => refetch()} />;
  }

  const orders = ordersData?.data ?? [];

  return (
    <div className="space-y-8 mt-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`lastik text-4xl font-medium text-gray-900 uppercase`}>My Orders</h1>
          <p className="text-xl text-gray-800 mt-1">Track and manage your orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-base text-gray-400 mb-8">You haven&apos;t placed any orders with us yet.</p>
          <Link href="/products" className="inline-flex items-center px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const status = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
            const StatusIcon = status.icon;

            return (
              <div key={order.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-gray-50/50 border-b border-gray-100 gap-4">
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Order Placed</p>
                      <p className="text-sm font-semibold text-gray-900">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total</p>
                      <p className="text-sm font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Order #</p>
                      <p className="text-sm font-semibold text-gray-900">{order.orderNumber}</p>
                    </div>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${status.bg} ${status.color}`}>
                    <StatusIcon className="h-4 w-4" />
                    <span className="text-sm font-bold uppercase tracking-wider">{status.label}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="divide-y divide-gray-50">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                        <div className="w-16 h-16 bg-gray-50 rounded-lg flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{item.productName}</h4>
                          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                            Qty: {item.quantity} • ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-sm text-gray-400 pt-4">
                        + {order.items.length - 3} more items
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-gray-50">
                    <Link href={`/dashboard/orders/${order.id}`} className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-2.5 bg-[#D4AF37] text-white rounded-lg text-sm font-semibold hover:bg-[#C4A030] transition-colors">
                      View Details
                    </Link>
                    <button className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                      Track Order
                    </button>
                    {order.status === 'delivered' && (
                      <button className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                        Return Items
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
