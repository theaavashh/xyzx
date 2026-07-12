"use client";

import { useCallback, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HeroBanner } from './types';
import { useHeroBanner } from './hooks/useHeroBanner';
import { HeroSkeleton } from './skeleton/HeroSkeleton';

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
    </div>
  );
}

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const rafRef = useRef<number>(0);

  const { data: slidesData, isLoading } = useHeroBanner();
  const slides = slidesData || [];
  const slideCount = slides.length;

  if (isLoading || slideCount === 0) return <HeroSkeleton />;

  const goTo = useCallback((index: number) => {
    if (slideCount === 0) return;
    setCurrent((index + slideCount) % slideCount);
    setProgress(0);
    progressRef.current = 0;
  }, [slideCount]);

  useEffect(() => {
    if (!slides || slides.length <= 1 || isPaused) return;
    const total = slides.length;
    let start: number | null = null;

    function tick(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min(elapsed / AUTOSLIDE_INTERVAL, 1);
      progressRef.current = pct;
      setProgress(pct);
      if (pct >= 1) {
        setCurrent((prev) => (prev + 1) % total);
        start = null;
        progressRef.current = 0;
        setProgress(0);
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [current, isPaused, slides]);

  return (
    <section
      className="relative w-full h-[85vh] md:h-[100vh] min-h-[600px] md:min-h-[900px] overflow-hidden bg-gray-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={slides[current].id}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] as [number, number, number, number] }}
          className="absolute inset-0 z-[1]"
        >
          <HeroBannerSlide banner={slides[current]} />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 z-20 px-4 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[current].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-white max-w-4xl xl:max-w-6xl w-full pointer-events-auto"
        >
          {slides[current].subtitle && (
            <p className="text-2xl md:text-3xl lg:text-4xl mb-8 drop-shadow-md">
              {slides[current].subtitle}
            </p>
          )}
          {slides[current].title && (
            <h1 className="lastik text-4xl md:text-6xl lg:text-7xl uppercase leading-tight drop-shadow-lg mt-4">
              {slides[current].title}
            </h1>
          )}
          {slides[current].buttonText && (
            <a
              href={slides[current].buttonUrl || '/products'}
              className="inline-block mt-8 bg-white text-black px-7 py-3 rounded-xs border border-white shadow-md font-semibold text-md uppercase tracking-wider hover:bg-transparent hover:text-white transition-all duration-300"
            >
              {slides[current].buttonText}
            </a>
          )}
        </motion.div>
        </AnimatePresence>
      </div>

      {slides.length > 1 && (
        <>
          <div className="absolute bottom-6 right-6 z-30 flex items-center gap-1.5">
            {slides.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => goTo(index)}
                className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
                  index === current ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
