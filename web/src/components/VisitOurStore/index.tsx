'use client';

import { memo, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

  const storeData = data;

  if (isLoading) return <VisitOurStoreSkeleton />;
  if (!storeData || !storeData.isActive) return null;

  return (
    <section className="relative py-10 bg-white overflow-hidden">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
  {storeData.image && (
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl md:rounded-3xl overflow-hidden">
            <Image
              src={storeData.image}
              alt={`${storeData.title} - ${storeData.city}`}
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h2 className="lastik text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 drop-shadow-lg">
                {storeData.title}
              </h2>
              {storeData.description && (
                <p className="text-white/90 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed font-light px-2 drop-shadow-md">
                  {storeData.description}
                </p>
              )}
              {storeData.ctaText && storeData.ctaUrl && (
                <Link
                  href={storeData.ctaUrl}
                  target={storeData.ctaUrl.startsWith('http') ? '_blank' : undefined}
                  rel={storeData.ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="mt-6 inline-block bg-[#D4AF37] text-white px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded-sm hover:bg-[#c9a32e] transition-all duration-300"
                >
                  {storeData.ctaText}
                </Link>
              )}
            </div>
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
