'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Navigation, Store, Check } from 'lucide-react';
import Image from 'next/image';

interface StoreHours {
  days: string;
  hours: string;
}

interface StoreData {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string | null;
  email: string | null;
  image: string | null;
  mapEmbedUrl: string | null;
  hours: StoreHours[];
  features: string[];
  isActive: boolean;
  order: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export default function StoresPage() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/v1/public/store-locations/public`);
        const json = await res.json();
        if (Array.isArray(json.data)) {
          setStores(json.data);
        }
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-zinc-900 mb-4">
            OUR STORES
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-lg">
            Visit us in person for personalized styling, our full collection, and a curated in-store experience.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[0, 1].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-zinc-100 rounded-2xl mb-6" />
                <div className="h-6 w-48 bg-zinc-200 rounded mb-4" />
                <div className="h-4 w-72 bg-zinc-100 rounded mb-2" />
                <div className="h-4 w-56 bg-zinc-100 rounded" />
              </div>
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-20">
            <Store className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500 text-sm">No store locations are available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {stores.map((store, idx) => {
              const fullAddress = `${store.address}, ${store.city}, ${store.state} ${store.zip}`;
              const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`;
              return (
                <motion.div
                  key={store.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="border border-black/10 rounded-2xl overflow-hidden bg-white"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[16/10] bg-zinc-100">
                    {store.image ? (
                      <Image
                        src={store.image}
                        alt={store.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store className="w-16 h-16 text-zinc-300" />
                      </div>
                    )}
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                        {store.city}, {store.state}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-4">
                      {store.name}
                    </h2>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                        <p className="text-sm text-zinc-600">
                          {store.address}<br />
                          {store.city}, {store.state} {store.zip}
                        </p>
                      </div>
                      {store.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                          <a href={`tel:${store.phone}`} className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
                            {store.phone}
                          </a>
                        </div>
                      )}
                      {store.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                          <a href={`mailto:${store.email}`} className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
                            {store.email}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Hours */}
                    {Array.isArray(store.hours) && store.hours.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-zinc-400" />
                          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Store Hours</span>
                        </div>
                        <div className="space-y-1.5">
                          {store.hours.map((h, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-zinc-500">{h.days}</span>
                              <span className="text-zinc-800 font-medium">{h.hours}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    {Array.isArray(store.features) && store.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {store.features.map((f, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs text-zinc-600 bg-black/5 rounded-full"
                          >
                            <Check className="w-3 h-3 text-zinc-500" />
                            {f}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Map */}
                    {store.mapEmbedUrl && (
                      <div className="rounded-xl overflow-hidden border border-zinc-200 mb-6">
                        <iframe
                          src={store.mapEmbedUrl}
                          width="100%"
                          height="200"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title={`${store.name} location`}
                        />
                      </div>
                    )}

                    {/* CTA */}
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
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
