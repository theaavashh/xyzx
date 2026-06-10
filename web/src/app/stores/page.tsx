'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import { fetchVisitOurStore } from '@/components/VisitOurStore/utils/api';
import type { VisitOurStoreData } from '@/components/VisitOurStore/types';

export default function StoresPage() {
  const [store, setStore] = useState<VisitOurStoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const result = await fetchVisitOurStore();
        if (mounted) setStore(result);
      } catch {
        if (mounted) setStore(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-4 h-4 border border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!store?.isActive) return null;

  const fullAddress = `${store.address}, ${store.city}, ${store.state} ${store.zip}`;
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="mb-10">
          <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-[0.2em]">Find a Store</span>
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight mt-2 mb-3">Our Flagship Store</h1>
          <p className="text-sm text-zinc-500">Visit us in person and experience RaphArch.</p>
        </div>

        {store.image && (
          <div className="rounded-xl overflow-hidden border border-zinc-200 mb-10">
            <Image
              src={store.image}
              alt="Store"
              width={1200}
              height={500}
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">Address</p>
                <p className="text-sm text-zinc-900">{store.address}</p>
                <p className="text-xs text-zinc-500">{store.city}, {store.state} {store.zip}</p>
              </div>
            </div>
            {store.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">Phone</p>
                  <a href={`tel:${store.phone}`} className="text-sm text-zinc-900 hover:underline">{store.phone}</a>
                </div>
              </div>
            )}
            {store.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">Email</p>
                  <a href={`mailto:${store.email}`} className="text-sm text-zinc-900 hover:underline">{store.email}</a>
                </div>
              </div>
            )}
          </div>

          {store.hours && store.hours.length > 0 && (
            <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-100">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-zinc-400" />
                <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Store Hours</p>
              </div>
              <div className="space-y-2.5">
                {store.hours.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">{h.days}</span>
                    <span className="text-zinc-900 font-medium">{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {store.mapEmbedUrl && (
          <div className="rounded-xl overflow-hidden border border-zinc-200 h-[300px] mb-10">
            <iframe
              src={store.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Store Location"
            />
          </div>
        )}

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Get Directions
        </a>
      </div>
    </div>
  );
}
