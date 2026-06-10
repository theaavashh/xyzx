'use client';

import { useAuth } from '@/contexts/AuthContextTanStack';
import { Package, Heart, Star, ArrowRight, ShoppingBag, Gift, Truck, Key, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo } from 'react';
import { useDashboardStats, useOrders } from '@/lib/dashboard/hooks';
import { STATUS_STYLES } from '@/lib/constants';
import { ErrorState } from '@/components/dashboard/ErrorState';

function DashboardSkeleton() {
  return (
    <div className="space-y-10 max-w-full mx-auto px-4 sm:px-8 lg:px-12 py-10 animate-pulse">
      <div className="bg-gray-100 rounded-[2rem] h-64 md:h-80" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-3xl p-8 h-40" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
  const { data: ordersData, isLoading: ordersLoading, error: ordersError, refetch: refetchOrders } = useOrders({ limit: 4 });

  const handleRetry = useCallback(() => {
    refetchStats();
    refetchOrders();
  }, [refetchStats, refetchOrders]);

  if (statsLoading || ordersLoading) {
    return <DashboardSkeleton />;
  }

  if (statsError || ordersError) {
    const errorMsg = (statsError as Error)?.message || (ordersError as Error)?.message || "Unable to load your dashboard data.";
    return (
      <div className="max-w-full mx-auto px-4 sm:px-8 lg:px-12 py-10">
        <ErrorState 
          message={`${errorMsg}. Please ensure your backend API server is running at http://localhost:9999.`} 
          onRetry={handleRetry} 
        />
      </div>
    );
  }

  const latestOrders = useMemo(
    () => ordersData?.data ?? [],
    [ordersData?.data],
  );

  return (
    <div className="space-y-12 max-w-full mx-auto px-4 sm:px-8 lg:px-12 py-10">
      {/* Premium Welcome Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 text-white min-h-[360px] flex items-center shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
           <div className="w-full h-full grid grid-cols-8 grid-rows-8">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-white/20" />
              ))}
           </div>
        </div>
        
        <div className="relative z-20 px-8 md:px-16 lg:px-24 py-12 space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full mb-2">
              <Star className="h-3 w-3 text-[#D4AF37]" fill="#D4AF37" />
              <span className="text-[#D4AF37] font-bold text-[10px] uppercase tracking-[0.25em]">Premium Member</span>
            </div>
            <h1 className={`lastik text-4xl md:text-6xl lg:text-7xl uppercase leading-none tracking-tight`}>
              Hello, {user?.firstName || user?.username}
            </h1>
          </div>
          <p className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed font-medium">
            Step into your personalized RaphArch suite. Your style, your orders, and your exclusive benefits, all in one place.
          </p>
          <div className="flex flex-wrap items-center gap-6 pt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 bg-[#D4AF37] hover:bg-[#C4A030] text-white px-10 py-5 rounded-full text-base font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_15px_30px_rgba(212,175,55,0.25)] group"
            >
              Explore Collection
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Activity Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Orders Placed', value: stats?.totalOrders ?? 0, icon: Package, desc: 'View history' },
          { label: 'Wishlist Items', value: stats?.wishlistCount ?? 0, icon: Heart, desc: 'Your favorites' },
          { label: 'Reward Points', value: stats?.rewardsBalance ?? 0, icon: Star, desc: 'Redeemable now' },
          { label: 'VIP Status', value: 'Active', icon: Gift, desc: 'Member exclusive' }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-[2rem] p-8 flex flex-col justify-between hover:shadow-xl hover:shadow-gray-200/40 transition-all group border-b-4 border-b-transparent hover:border-b-[#D4AF37]">
            <div className="flex items-center justify-between mb-8">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-[#D4AF37]/5 transition-colors">
                <stat.icon className="h-7 w-7 text-gray-400 group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{stat.desc}</span>
            </div>
            <div>
              <p className="text-5xl font-black text-gray-900 tracking-tighter mb-2">{stat.value}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Orders - Visual Feed */}
        <section className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className={`lastik text-3xl text-gray-900 uppercase tracking-tight`}>
              Shipment Feed
            </h2>
            <Link href="/dashboard/orders" className="text-xs font-bold text-[#D4AF37] hover:text-[#C4A030] uppercase tracking-[0.2em] flex items-center gap-2 group">
              See All Activity <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-6">
            {latestOrders.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-[2rem] p-16 text-center shadow-sm">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <ShoppingBag className="h-10 w-10 text-gray-200" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 uppercase">Your Feed is Empty</h3>
                <p className="text-gray-400 text-lg mb-10 max-w-sm mx-auto">Discover the latest collections and start your journey with RaphArch.</p>
                <Link href="/products" className="inline-block bg-gray-900 text-white px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-black transition-all active:scale-95">
                  Browse Shop
                </Link>
              </div>
            ) : (
              latestOrders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-100 rounded-[2rem] p-8 flex flex-col md:flex-row md:items-center gap-8 hover:shadow-lg transition-all border-l-8 border-l-transparent hover:border-l-[#D4AF37]">
                  <div className="w-28 h-28 bg-gray-50 rounded-3xl flex-shrink-0 flex items-center justify-center border border-gray-100 shadow-inner">
                    <Package className="h-10 w-10 text-gray-200" strokeWidth={1} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest">#{order.orderNumber}</span>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${STATUS_STYLES[order.status] ?? 'bg-gray-50 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Purchase of {order.itemCount} Piece{order.itemCount > 1 ? 's' : ''}
                    </h3>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                      Ordered {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-6">
                    <span className="text-3xl font-black text-gray-900 tracking-tighter">${order.total.toFixed(2)}</span>
                    <Link href={`/dashboard/orders`} className="px-8 py-3 bg-gray-50 hover:bg-gray-900 hover:text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                      View Logistics
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Style & Support sidebar */}
        <aside className="space-y-12">
          <div className="space-y-6">
            <h2 className={`lastik text-2xl text-gray-900 uppercase tracking-tight`}>
              Curated Edit
            </h2>
            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group cursor-pointer shadow-xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/20 rounded-full blur-[80px] -mr-24 -mt-24 transition-all duration-700 group-hover:scale-150" />
              <div className="relative z-10 space-y-6">
                <div>
                  <span className="text-[#D4AF37] font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">New Season</span>
                  <h3 className="text-3xl font-bold tracking-tight leading-tight uppercase">Essentials<br/>Drop '26</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">Personalized looks based on your recent activity and saved items.</p>
                <div className="flex items-center gap-3 text-[#D4AF37] font-bold text-xs uppercase tracking-widest group-hover:gap-5 transition-all">
                  Shop The Edit <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className={`lastik text-2xl text-gray-900 uppercase tracking-tight`}>
              Quick Services
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Order Logistics', icon: Truck, href: '/dashboard/orders' },
                { label: 'Shipping Registry', icon: MapPin, href: '/dashboard/addresses' },
                { label: 'Auth & Privacy', icon: Key, href: '/dashboard/settings' },
              ].map((action, i) => (
                <Link key={i} href={action.href} className="flex items-center gap-5 p-6 bg-white border border-gray-100 rounded-[1.5rem] hover:shadow-lg hover:border-[#D4AF37]/30 transition-all group">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-[#D4AF37]/10 transition-colors">
                    <action.icon className="h-6 w-6 text-gray-400 group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-[0.2em] group-hover:text-gray-900 transition-colors">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
