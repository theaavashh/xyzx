'use client';

import { memo, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Music, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { VisitOurStoreSkeleton } from './skeleton';
import { fetchVisitOurStore } from './utils/api';
import type { VisitOurStoreData } from './types';

function VisitOurStoreContent() {
  const [data, setData] = useState<VisitOurStoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        const result = await fetchVisitOurStore();
        if (mounted) {
          setData(result);
        }
      } catch {
        if (mounted) setData(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadData();

    return () => { mounted = false; };
  }, []);

  if (isLoading) return <VisitOurStoreSkeleton />;
  if (!data?.isActive) return null;

  return (
    <section className="relative py-10 bg-white overflow-hidden">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="lastik text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4 md:mb-6">
            {data.title}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed font-light px-2">
            {data.description}
          </p>
        </div>

        {data.image && (
          <div className="relative w-full rounded-xl md:rounded-3xl overflow-hidden">
            <Image
              src={data.image}
              alt={`${data.title} - ${data.city}`}
              width={1450}
              height={1085}
              className="w-full h-auto"
              priority
              unoptimized
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="space-y-4">
            <h3 className="lastik text-2xl sm:text-3xl text-gray-900 mb-4">Contact & Location</h3>

            <div className="flex items-start gap-3 text-gray-500">
              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>
                {data.address}, {data.city}, {data.state} {data.zip}, {data.country}
              </span>
            </div>

            {data.phone && (
              <div className="flex items-center gap-3 text-gray-500">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href={`tel:${data.phone}`} className="hover:text-gray-700 transition-colors">{data.phone}</a>
              </div>
            )}

            {data.email && (
              <div className="flex items-center gap-3 text-gray-500">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href={`mailto:${data.email}`} className="hover:text-gray-700 transition-colors">{data.email}</a>
              </div>
            )}

            {data.hours && data.hours.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-3 text-gray-900 font-semibold mb-2">
                  <Clock className="w-5 h-5" />
                  <span>Store Hours</span>
                </div>
                <div className="space-y-1 text-gray-500 text-sm">
                  {data.hours.filter(h => h.isActive !== false).map((h, i) => (
                    <div key={i} className="flex justify-between max-w-xs">
                      <span className="font-medium">{h.days}</span>
                      <span>{h.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <a href="https://facebook.com/rapharch" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors" />
              </a>
              <a href="https://instagram.com/rapharch" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors" />
              </a>
              <a href="https://tiktok.com/@rapharch" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <Music className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors" />
              </a>
            </div>
          </div>

          {data.mapEmbedUrl && (
            <div className="rounded-xl overflow-hidden">
              <iframe
                src={data.mapEmbedUrl}
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Store Location"
              />
            </div>
          )}
        </div>

        {data.ctaText && data.ctaUrl && (
          <div className="text-center mt-10">
            <Link
              href={data.ctaUrl}
              target={data.ctaUrl.startsWith('http') ? '_blank' : undefined}
              rel={data.ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="inline-block bg-[#D4AF37] text-white px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded-sm hover:bg-[#c9a32e] transition-all duration-300"
            >
              {data.ctaText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default memo(function VisitOurStore() {
  return <VisitOurStoreContent />;
});

export type { VisitOurStoreData } from './types';
export { fetchVisitOurStore } from './utils/api';
