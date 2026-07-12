'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Navigation, Search, Store, ChevronRight } from 'lucide-react';
import Link from 'next/link';

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
  phone: string;
  email: string;
  image: string;
  mapEmbedUrl: string;
  hours: StoreHours[];
  features: string[];
  isActive: boolean;
  order: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

const FALLBACK_STORES: StoreData[] = [
  {
    id: 'store-1',
    name: 'RaphArch Flagship Store',
    slug: 'flagship',
    address: '245 Fashion Avenue',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
    phone: '+1 (212) 555-0189',
    email: 'flagship@rapharch.com',
    image: '',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.966309591936!2d-73.98721368459413!3d40.74881797932797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1',
    hours: [
      { days: 'Monday - Friday', hours: '10:00 AM - 8:00 PM' },
      { days: 'Saturday', hours: '10:00 AM - 7:00 PM' },
      { days: 'Sunday', hours: '11:00 AM - 6:00 PM' },
    ],
    features: ['Full Collection', 'Personal Styling', 'Alterations'],
    isActive: true,
    order: 1,
  },
  {
    id: 'store-2',
    name: 'RaphArch SoHo',
    slug: 'soho',
    address: '128 Prince Street',
    city: 'New York',
    state: 'NY',
    zip: '10012',
    country: 'United States',
    phone: '+1 (212) 555-0247',
    email: 'soho@rapharch.com',
    image: '',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.9485096879583!2d-74.00181348459477!3d40.72430537933082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2598f5d5b5b5b%3A0x5b5b5b5b5b5b5b5b!2sPrince%20St!5e0!3m2!1sen!2sus!4v1',
    hours: [
      { days: 'Monday - Saturday', hours: '10:00 AM - 9:00 PM' },
      { days: 'Sunday', hours: '12:00 PM - 6:00 PM' },
    ],
    features: ['Limited Edition', 'Appointments'],
    isActive: true,
    order: 2,
  },
  {
    id: 'store-3',
    name: 'RaphArch Los Angeles',
    slug: 'los-angeles',
    address: '8905 Melrose Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90069',
    country: 'United States',
    phone: '+1 (310) 555-0312',
    email: 'la@rapharch.com',
    image: '',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.898609374352!2d-118.3833226845818!3d34.08278298059894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2b9f5b5b5b5b5%3A0x5b5b5b5b5b5b5b5b!2sMelrose%20Ave!5e0!3m2!1sen!2sus!4v1',
    hours: [
      { days: 'Monday - Friday', hours: '11:00 AM - 7:00 PM' },
      { days: 'Saturday', hours: '10:00 AM - 7:00 PM' },
      { days: 'Sunday', hours: '12:00 PM - 5:00 PM' },
    ],
    features: ['Full Collection', 'Tailoring'],
    isActive: true,
    order: 3,
  },
  {
    id: 'store-4',
    name: 'RaphArch Miami',
    slug: 'miami',
    address: '72 Collins Avenue',
    city: 'Miami Beach',
    state: 'FL',
    zip: '33139',
    country: 'United States',
    phone: '+1 (305) 555-0478',
    email: 'miami@rapharch.com',
    image: '',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3593.210037934737!2d-80.13176768455673!3d25.782112583618265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b5b5b5b5b5b5%3A0x5b5b5b5b5b5b5b5b!2sCollins%20Ave!5e0!3m2!1sen!2sus!4v1',
    hours: [
      { days: 'Monday - Sunday', hours: '10:00 AM - 9:00 PM' },
    ],
    features: ['Resort Wear', 'Personal Styling'],
    isActive: true,
    order: 4,
  },
];

function StoreCard({ store, index }: { store: StoreData; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const fullAddress = `${store.address}, ${store.city}, ${store.state} ${store.zip}`;
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      layout
      className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg hover:border-zinc-300 transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Store className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                {store.city}, {store.state}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">{store.name}</h3>
          </div>
          <span className="shrink-0 text-[10px] font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
            Open Now
          </span>
        </div>

        <div className="space-y-2.5 mb-4">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
            <p className="text-xs text-zinc-600">
              {store.address}<br />
              {store.city}, {store.state} {store.zip}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <a href={`tel:${store.phone}`} className="text-xs text-zinc-600 hover:text-zinc-900 transition-colors">
              {store.phone}
            </a>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <a href={`mailto:${store.email}`} className="text-xs text-zinc-600 hover:text-zinc-900 transition-colors">
              {store.email}
            </a>
          </div>
        </div>

        {store.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {store.features.map((f) => (
              <span
                key={f}
                className="text-[10px] font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md"
              >
                {f}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between py-2.5 px-4 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-xs font-medium text-zinc-600">Store Hours</span>
          </div>
          <ChevronRight
            className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
          />
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-3 pb-1 space-y-1.5">
                {store.hours.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-xs px-4">
                    <span className="text-zinc-500">{h.days}</span>
                    <span className="text-zinc-800 font-medium">{h.hours}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {store.mapEmbedUrl && (
          <div className={`overflow-hidden rounded-lg border border-zinc-100 transition-all duration-300 ${expanded ? 'mt-3 h-40' : 'mt-3 h-0'}`}>
            <iframe
              src={store.mapEmbedUrl}
              width="100%"
              height="160"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${store.name} location`}
            />
          </div>
        )}

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 text-white text-xs font-medium rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          Get Directions
        </a>
      </div>
    </motion.div>
  );
}

export default function StoresPage() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/v1/public/stores');
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setStores(json.data);
        } else {
          setStores(FALLBACK_STORES);
        }
      } catch {
        setStores(FALLBACK_STORES);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return stores;
    const q = search.toLowerCase();
    return stores.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
    );
  }, [stores, search]);

  const totalLocations = stores.length;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="lastik text-3xl sm:text-4xl md:text-5xl text-zinc-900 mb-4">
              VISIT US<br /><span className="text-amber-500">IN PERSON</span>
            </h1>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              Experience RaphArch firsthand. Visit one of our stores for personalized styling and our full collection.
            </p>
            <hr className="border-zinc-200" />
          </motion.div>

          <div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse bg-white rounded-xl border border-zinc-200 p-6">
                    <div className="h-4 w-24 bg-zinc-200 rounded mb-3" />
                    <div className="h-6 w-40 bg-zinc-200 rounded mb-4" />
                    <div className="space-y-2 mb-4">
                      <div className="h-3 w-full bg-zinc-100 rounded" />
                      <div className="h-3 w-3/4 bg-zinc-100 rounded" />
                      <div className="h-3 w-1/2 bg-zinc-100 rounded" />
                    </div>
                    <div className="h-10 w-full bg-zinc-100 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by city, state, or store name..."
                    className="w-full pl-11 pr-4 py-3 text-sm text-black border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 bg-white"
                  />
                </div>

                {search && (
                  <p className="text-xs text-zinc-400 mb-4">
                    {filtered.length} of {totalLocations} location{totalLocations !== 1 ? 's' : ''} found
                  </p>
                )}

                {filtered.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <Search className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
                    <p className="text-zinc-500 font-medium">No stores found</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Try a different search or browse all locations
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence mode="popLayout">
                      {filtered.map((store, idx) => (
                        <StoreCard key={store.id} store={store} index={idx} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-8 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 md:p-10 text-center"
                >
                  <h2 className="text-xl font-bold text-white mb-2">Can&apos;t Make It In Store?</h2>
                  <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
                    Shop our full collection online with free shipping on orders over $200.
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-zinc-900 font-semibold rounded-xl hover:bg-amber-300 transition-all text-sm shadow-lg shadow-amber-400/20"
                  >
                    Shop Online
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
