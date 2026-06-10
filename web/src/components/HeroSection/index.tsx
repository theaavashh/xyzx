"use client";

import { useCallback, useState } from 'react';
import { useHeroBanner } from './hooks';
import type { HeroBanner } from './types';

const AUTOSLIDE_INTERVAL = 5000;

function HeroBannerSlide({ banner }: { banner: HeroBanner }) {
  const desktopSrc = banner.videoUrl || banner.largeImage;
  const mobileSrc = banner.smallImage || banner.largeImage;
  const hasMedia = !!desktopSrc;

  return (
    <div className="absolute inset-0 w-full h-full">
      {banner.videoUrl ? (
        <video
          src={banner.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : hasMedia ? (
        <picture>
          <source media="(min-width: 768px)" srcSet={desktopSrc} />
          <img
            src={mobileSrc}
            alt={banner.title || 'Hero banner'}
            className="absolute inset-0 w-full h-full object-cover"
            decoding="async"
          />
        </picture>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black" />
      )}

      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 via-black/20 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />

      <div className="absolute bottom-5 inset-x-0 z-20 flex items-end justify-center px-4 pb-8 md:pb-12">
        <div className="text-center text-white max-w-4xl mx-auto">
          {banner.title && (
            <h1 className={`lastik text-4xl md:text-6xl lg:text-7xl uppercase leading-tight drop-shadow-lg`}>
              {banner.title}
            </h1>
          )}
          {banner.subtitle && (
            <p className="text-xl md:text-2xl lg:text-3xl mb-8 drop-shadow-md">
              {banner.subtitle}
            </p>
          )}
          {banner.buttonText && (
            <a
              href={banner.buttonUrl || '/products'}
              className="inline-block mt-8 bg-[#D4AF37] text-black px-7 py-3 rounded-full shadow-md font-semibold text-md uppercase tracking-wider hover:bg-[#c9a32e] transition-all duration-300"
            >
              {banner.buttonText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

const FALLBACK_BANNERS: HeroBanner[] = [
  {
    id: 'fallback-1',
    title: 'Summer Collection',
    subtitle: 'Discover the latest trends for the season',
    largeImage: '/raphard-main-banner.webp',
    smallImage: '/raphard-main-banner.webp',
    buttonText: 'Shop Now',
    buttonUrl: '/products',
    isActive: true,
    order: 1,
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { data: apiBanners } = useHeroBanner();

  const slides = (apiBanners && apiBanners.length > 0) ? apiBanners : FALLBACK_BANNERS;

  const goTo = useCallback((index: number) => {
    setCurrent((index + slides.length) % slides.length);
  }, [slides.length]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  return (
    <section
      className="relative w-full h-[70vh] md:h-[95vh] min-h-[500px] md:min-h-[800px] overflow-hidden bg-gray-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ${index === current ? 'opacity-100 z-[1]' : 'opacity-0 z-0'}`}
          aria-hidden={index !== current}
        >
          <HeroBannerSlide banner={banner} />
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7l-5 5 5 5M8 7l-5 5 5 5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7l5 5-5 5M16 7l5 5-5 5" />
            </svg>
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {slides.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => goTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${index === current ? 'bg-[#D4AF37] w-6' : 'bg-[#D4AF37]/50 hover:bg-[#D4AF37]/80'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
