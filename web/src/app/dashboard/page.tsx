'use client';

import { useAuth } from '@/contexts/AuthContextTanStack';
import { Package, Heart, ArrowRight, ShoppingBag, Truck, MapPin, Settings } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useDashboardStats, useOrders } from '@/lib/dashboard/hooks';
import { STATUS_STYLES } from '@/lib/constants';

function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
      <div className="h-8 bg-gray-100 rounded w-48" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-xl p-6 h-24" />
        ))}
      </div>
      <div className="bg-gray-100 rounded-xl h-64" />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: ordersData, isLoading: ordersLoading } = useOrders({ limit: 4 });

  if (statsLoading || ordersLoading) {
    return <DashboardSkeleton />;
  }

  const latestOrders = useMemo(() => ordersData?.data ?? [], [ordersData?.data]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user?.firstName || user?.username}</h1>
          <p className="text-sm text-gray-500 mt-1">Here&apos;s what&apos;s happening with your account today.</p>
        </div>
        <Link
          href="/products"
          className="hidden sm:inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Browse Shop
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: Package },
          { label: 'Wishlist', value: stats?.wishlistCount ?? 0, icon: Heart },
          { label: 'Reward Points', value: stats?.rewardsBalance ?? 0, icon: Star },
          { label: 'VIP Status', value: 'Active', icon: ShieldCheck },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-gray-500" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              View all
            </Link>
          </div>

          {latestOrders.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-7 w-7 text-gray-300" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">No orders yet</h3>
              <p className="text-sm text-gray-500 mb-6">Start shopping to see your orders here.</p>
              <Link href="/products" className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Browse Shop
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {latestOrders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-5 hover:border-gray-300 transition-colors">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-medium text-gray-900">#{order.orderNumber}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[order.status] || 'bg-gray-50 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {order.itemCount} item{order.itemCount > 1 ? 's' : ''} &middot; {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                    <Link href="/dashboard/orders" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">Details</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Links */}
        <aside className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
            <div className="space-y-2">
              {[
                { label: 'Orders', icon: Truck, href: '/dashboard/orders' },
                { label: 'Addresses', icon: MapPin, href: '/dashboard/addresses' },
                { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
              ].map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors group"
                >
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                    <link.icon className="h-4 w-4 text-gray-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Need help?</h3>
            <p className="text-xs text-gray-500 mb-3">Contact our support team for assistance.</p>
            <Link href="/contact-us" className="text-sm font-medium text-gray-900 hover:underline">
              Contact Support
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Star(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ShieldCheck(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
