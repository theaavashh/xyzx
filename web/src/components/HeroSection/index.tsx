"use client";

import { useCallback, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HeroBanner } from './types';
import { useHeroBanner } from './hooks/useHeroBanner';
import { HeroSkeleton } from './skeleton/HeroSkeleton';

const AUTOSLIDE_INTERVAL = 5000;

function positionClasses(pos?: string): { container: string; inner: string } {
  switch (pos) {
    case 'TOP_LEFT':
      return { container: 'top-10 items-start', inner: 'text-left items-start' };
    case 'TOP_RIGHT':
      return { container: 'top-10 items-end', inner: 'text-right items-end' };
    case 'BOTTOM_LEFT':
      return { container: 'bottom-14 items-start', inner: 'text-left items-start' };
    case 'BOTTOM_RIGHT':
      return { container: 'bottom-14 items-end', inner: 'text-right items-end' };
    default:
      return { container: 'bottom-14 items-center', inner: 'text-center items-center' };
  }
}



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
        <div className="absolute inset-0 bg-white" />
      )}
    </div>
  );
}

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const rafRef = useRef<number>(0);
  const wheelLockRef = useRef(false);

  const { data: slidesData, isLoading } = useHeroBanner();
  const slides = slidesData || [];
  const slideCount = slides.length;

  const goTo = useCallback((index: number) => {
    if (slideCount === 0) return;
    const target = (index + slideCount) % slideCount;
    setCurrent(target);
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

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLElement>) => {
      if (slideCount <= 1 || wheelLockRef.current) return;
      wheelLockRef.current = true;
      // Always go forward (right-to-left), regardless of scroll direction
      goTo(current + 1);
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 1400);
    },
    [slideCount, current, goTo],
  );

  if (isLoading || slideCount === 0) return <HeroSkeleton />;

  return (
    <section
      className="relative w-full h-[90vh] min-h-[600px] overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onWheel={handleWheel}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={`hero-${current}`}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] as [number, number, number, number] }}
          className="absolute inset-0 z-[1] will-change-transform"
        >
          <HeroBannerSlide banner={slides[current]} />
        </motion.div>
      </AnimatePresence>
      <div className={`absolute inset-x-0 z-20 px-4 pointer-events-none flex flex-col ${positionClasses(slides[current].position).container}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[current].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          className={`text-white max-w-6xl xl:max-w-[90rem] w-full pointer-events-auto ${positionClasses(slides[current].position).inner}`}
        >
          {slides[current].title && (
              <h1 className="bound-regular text-3xl md:text-5xl leading-tight drop-shadow-lg mb-6 uppercase tracking-wide font-extrabold">
               {slides[current].title}
             </h1>
          )}
          {slides[current].subtitle && (
              <p className="text-sm sm:text-base lg:text-lg drop-shadow-md mb-4 font-medium tracking-wide">
              {slides[current].subtitle}
            </p>
          )}
          {slides[current].buttonText && (
            <a
              href={slides[current].buttonUrl || '/products'}
                className="inline-block mt-2 bg-white text-gray-900 px-7 py-2 rounded-full border border-white shadow-md font-semibold text-sm sm:text-base uppercase tracking-wider hover:bg-transparent hover:text-white transition-all duration-300"
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
                  index === current ? 'bg-gray-900' : 'bg-gray-400 hover:bg-gray-600'
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
