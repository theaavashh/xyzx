'use client';

import { useEffect, useState } from 'react';
import { Package, Truck, Zap, Clock, Shield, Globe, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { fetchShippingContent } from '@/components/Shipping/utils/api';
import type { ShippingContent } from '@/components/Shipping/types';

const methodIcons = [Package, Truck, Zap];
const infoIcons = [Clock, Shield, Package];

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
        <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!content) return null;

  const methods = content.methods.filter((m) => m.isActive).sort((a, b) => a.order - b.order);
  const infoItems = content.info.filter((i) => i.isActive).sort((a, b) => a.order - b.order);
  const regions = content.regions.filter((r) => r.isActive).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-14">
          <div>
            <span className="inline-block text-black/30 text-xs font-semibold tracking-[0.25em] uppercase mb-4 border-l-2 border-black/30 pl-4">
              Shipping
            </span>
            <h1 className="lastik text-3xl sm:text-4xl md:text-5xl text-black mb-4 leading-tight">
              {content.heroTitle}
            </h1>
            <p className="text-sm text-black/50 leading-relaxed mb-8">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-black/50">
              <span>Free over {content.freeShippingThreshold}</span>
              <span className="w-px h-3 bg-black/20" />
              <span>Global delivery</span>
              <span className="w-px h-3 bg-black/20" />
              <span>Members ship free</span>
            </div>
            <hr className="border-black/10 mt-8" />
          </div>

          <div className="space-y-10">
            {methods.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {methods.map((method, idx) => {
                  const Icon = methodIcons[idx] ?? Package;
                  return (
                    <div key={method.id} className="group bg-white rounded-xl border border-black/10 p-6 hover:shadow-xl hover:border-black/30 hover:-translate-y-0.5 transition-all duration-300">
                      <div className="w-11 h-11 bg-black/5 rounded-xl flex items-center justify-center mb-4 group-hover:bg-black/10 group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-5 h-5 text-black/60 group-hover:text-black transition-colors duration-300" />
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-black text-sm">{method.name}</h3>
                        <span className="text-lg font-bold text-black">{method.price}</span>
                      </div>
                      <p className="text-xs text-black/40 mb-2">{method.time}</p>
                      <p className="text-[11px] text-black/50 leading-relaxed">{method.description}</p>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="bg-black/5 rounded-xl border border-black/10 p-6 hover:bg-black/[0.07] transition-colors duration-300">
              <h2 className="text-xs font-medium text-black/40 uppercase tracking-wider mb-4">Free Shipping</h2>
              <p className="text-xs text-black/60 leading-relaxed mb-5">
                Free standard shipping on domestic orders over {content.freeShippingThreshold} and international orders over {content.freeInternationalThreshold}. Members always ship free.
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="border border-black/10 bg-white rounded-xl py-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <p className="text-sm font-bold text-black">{content.freeShippingThreshold}</p>
                  <p className="text-[10px] text-black/40 mt-0.5 uppercase tracking-wider">Domestic</p>
                </div>
                <div className="border border-black/10 bg-white rounded-xl py-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <p className="text-sm font-bold text-black">{content.freeInternationalThreshold}</p>
                  <p className="text-[10px] text-black/40 mt-0.5 uppercase tracking-wider">International</p>
                </div>
                <div className="bg-black text-white rounded-xl py-4 text-center hover:bg-black/90 hover:-translate-y-0.5 transition-all duration-300">
                  <p className="text-sm font-bold">$0</p>
                  <p className="text-[10px] text-white/50 mt-0.5 uppercase tracking-wider">Members</p>
                </div>
              </div>
            </div>

            {infoItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {infoItems.map((item, idx) => {
                  const Icon = infoIcons[idx] ?? Package;
                  return (
                    <div key={item.id} className="group bg-white rounded-xl border border-black/10 p-5 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                      <div className="w-9 h-9 bg-black text-white rounded-xl flex items-center justify-center mx-auto mb-3 text-xs font-bold group-hover:scale-110 transition-transform duration-300">
                        {idx + 1}
                      </div>
                      <Icon className="w-4 h-4 text-black/40 mx-auto mb-2 group-hover:text-black transition-colors duration-300" />
                      <h3 className="font-semibold text-black text-xs mb-1 group-hover:translate-x-0.5 transition-transform duration-300">{item.title}</h3>
                      <p className="text-[10px] text-black/50 leading-relaxed">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {regions.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-medium text-black/40 uppercase tracking-wider mb-3">International</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {regions.map((region) => (
                    <div key={region.id} className="group bg-white rounded-xl border border-black/10 p-4 flex items-center justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-black/5 rounded-lg flex items-center justify-center group-hover:bg-black/10 group-hover:scale-110 transition-all duration-300">
                          <Globe className="w-4 h-4 text-black/50 group-hover:text-black transition-colors duration-300" />
                        </div>
                        <div>
                          <p className="font-medium text-black text-sm">{region.region}</p>
                          <p className="text-[11px] text-black/40">{region.time}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-black">{region.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-black/10">
          <Link href="/faq" className="text-xs text-black/40 hover:text-black/60 transition-colors inline-flex items-center gap-1 group">
            Need help? <ChevronRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <Link href="/products" className="text-xs text-black/40 hover:text-black/60 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
