'use client';

import Image from 'next/image';
import Link from 'next/link';

const STORE_DATA = {
  title: 'Visit Our Store',
  description: 'Come visit us at our flagship store and experience the collection in person.',
  image: '/images/store.jpg',
  ctaText: 'Get Directions',
  ctaUrl: 'https://maps.google.com',
};

export default function VisitOurStore() {
  return (
    <section className="relative py-10 bg-[#F7F6F3] overflow-hidden">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {STORE_DATA.image && (
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl md:rounded-3xl overflow-hidden">
            <Image
              src={STORE_DATA.image}
              alt={STORE_DATA.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h2 className="swansea text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 drop-shadow-lg">
                {STORE_DATA.title}
              </h2>
              {STORE_DATA.description && (
                <p className="text-white/90 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed font-light px-2 drop-shadow-md">
                  {STORE_DATA.description}
                </p>
              )}
              {STORE_DATA.ctaText && STORE_DATA.ctaUrl && (
                <Link
                  href={STORE_DATA.ctaUrl}
                  target={STORE_DATA.ctaUrl.startsWith('http') ? '_blank' : undefined}
                  rel={STORE_DATA.ctaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="mt-6 inline-block bg-[#D4AF37] text-white px-8 py-3.5 text-sm font-bold tracking-wider uppercase rounded-sm hover:bg-[#c9a32e] transition-all duration-300"
                >
                  {STORE_DATA.ctaText}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
