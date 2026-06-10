'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, Package, Truck, Zap, Clock, Shield, Globe } from 'lucide-react';
import Link from 'next/link';
import { fetchShippingContent } from '@/components/Shipping/utils/api';
import type { ShippingContent } from '@/components/Shipping/types';

const icons = [Clock, Shield, Package];

export default function ShippingPage() {
  const [content, setContent] = useState<ShippingContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchShippingContent();
      setContent(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-4 h-4 border border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!content) return null;

  const methods = content.methods.filter((m) => m.isActive).sort((a, b) => a.order - b.order);
  const infoItems = content.info.filter((i) => i.isActive).sort((a, b) => a.order - b.order);
  const regions = content.regions.filter((r) => r.isActive).sort((a, b) => a.order - b.order);

  const methodIcons = [Package, Truck, Zap];

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="inline-block text-[10px] font-medium text-zinc-400 uppercase tracking-[0.2em] mb-4">Shipping</span>
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight mb-3">{content.heroTitle}</h1>
          <p className="text-sm text-zinc-500 leading-relaxed">{content.heroSubtitle}</p>
          <div className="flex items-center justify-center gap-4 mt-5">
            <span className="text-xs text-zinc-500">Free over {content.freeShippingThreshold}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-300" />
            <span className="text-xs text-zinc-500">Global delivery</span>
            <span className="w-1 h-1 rounded-full bg-zinc-300" />
            <span className="text-xs text-zinc-500">Members ship free</span>
          </div>
        </div>

        {methods.length > 0 && (
          <div className="mb-14">
            <h2 className="text-[10px] font-medium text-zinc-400 uppercase tracking-[0.2em] mb-5 text-center">Shipping Methods</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {methods.map((method, idx) => {
                const Icon = methodIcons[idx] ?? Package;
                return (
                  <div key={method.id} className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-zinc-600" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-zinc-900 text-sm">{method.name}</h3>
                      <span className="text-lg font-bold text-zinc-900">{method.price}</span>
                    </div>
                    <p className="text-xs text-zinc-400 mb-3">{method.time}</p>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">{method.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {infoItems.length > 0 && (
          <div className="mb-14">
            <h2 className="text-[10px] font-medium text-zinc-400 uppercase tracking-[0.2em] mb-5 text-center">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {infoItems.map((item, idx) => {
                const Icon = icons[idx] ?? Package;
                return (
                  <div key={item.id} className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm text-center">
                    <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div className="w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-4 h-4 text-zinc-500" />
                    </div>
                    <h3 className="font-semibold text-zinc-900 text-sm mb-2">{item.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-14">
          <h2 className="text-[10px] font-medium text-zinc-400 uppercase tracking-[0.2em] mb-5 text-center">Free Shipping</h2>
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <p className="text-xs text-zinc-600 leading-relaxed mb-5 text-center">
              Free standard shipping on domestic orders over {content.freeShippingThreshold} and international orders over {content.freeInternationalThreshold}. Members always ship free.
            </p>
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              <div className="border border-zinc-100 rounded-lg py-4 text-center">
                <p className="text-base font-bold text-zinc-900">{content.freeShippingThreshold}</p>
                <p className="text-[10px] text-zinc-400 mt-1">Domestic</p>
              </div>
              <div className="border border-zinc-100 rounded-lg py-4 text-center">
                <p className="text-base font-bold text-zinc-900">{content.freeInternationalThreshold}</p>
                <p className="text-[10px] text-zinc-400 mt-1">International</p>
              </div>
              <div className="bg-zinc-900 text-white rounded-lg py-4 text-center">
                <p className="text-base font-bold">$0</p>
                <p className="text-[10px] text-zinc-400 mt-1">Members</p>
              </div>
            </div>
          </div>
        </div>

        {regions.length > 0 && (
          <div className="mb-14">
            <h2 className="text-[10px] font-medium text-zinc-400 uppercase tracking-[0.2em] mb-5 text-center">International</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {regions.map((region) => (
                <div key={region.id} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 text-sm">{region.region}</p>
                      <p className="text-[11px] text-zinc-400">{region.time}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-zinc-900">{region.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-zinc-200">
          <Link href="/faq" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors inline-flex items-center gap-1">
            Need help? <ChevronRight className="w-3 h-3" />
          </Link>
          <Link href="/products" className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
