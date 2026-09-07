'use client';

import { useEffect, useState } from 'react';
import { Package, Truck, Zap, Clock, Shield, Globe, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { fetchShippingContent } from '@/components/Shipping/utils/api';
import { sanitizeHtml } from '@/lib/sanitize';
import type { ShippingContent } from '@/components/Shipping/types';

const methodIcons = [Package, Truck, Zap];
const infoIcons = [Clock, Shield, Package];

interface ContentPage {
  title: string;
  content: string;
  isActive: boolean;
}

async function fetchShippingDeliveryContent(): Promise<ContentPage | null> {
  try {
    const response = await fetch('/api/v1/content/slug/shipping-delivery');
    if (!response.ok) return null;
    const json = await response.json();
    if (!json.success || !json.data) return null;
    return json.data;
  } catch {
    return null;
  }
}

export default function ShippingPage() {
  const [content, setContent] = useState<ShippingContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageContent, setPageContent] = useState<string>('');
  const [pageTitle, setPageTitle] = useState<string>('');

  useEffect(() => {
    async function load() {
      const [shipData, contentData] = await Promise.all([
        fetchShippingContent(),
        fetchShippingDeliveryContent(),
      ]);
      setContent(shipData);
      if (contentData && contentData.isActive) {
        const safe = await sanitizeHtml(contentData.content);
        setPageContent(safe);
        setPageTitle(contentData.title);
      }
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

        {pageContent && (
          <section className="pt-10 border-t border-black/10">
            <h2 className="bound-regular text-2xl sm:text-3xl text-zinc-900 mb-6">
              {pageTitle || 'Shipping & Delivery'}
            </h2>
            <div
              className="text-zinc-600 prose prose-lg max-w-none prose-headings:text-zinc-900 prose-p:text-zinc-600 prose-li:text-zinc-600 prose-strong:text-zinc-600"
              dangerouslySetInnerHTML={{ __html: pageContent }}
            />
          </section>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-black/10 mt-10">
          <Link href="/faq" className="text-xs text-zinc-600/40 hover:text-zinc-600/60 transition-colors inline-flex items-center gap-1 group">
            Need help? <ChevronRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <Link href="/products" className="text-xs text-zinc-600/40 hover:text-zinc-600/60 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
