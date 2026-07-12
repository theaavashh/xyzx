'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { HeroImage } from './HeroImage';
import { HeroContent } from './HeroContent';
import { HeroProgress } from './HeroProgress';
import { fetchHeroSlides } from './utils/api';
import type { Slide } from './types';
import type { HeroProps } from './types';

const slideVariants = {
  enter: (dir: number) => ({
    y: dir > 0 ? '100%' : '-100%',
    scale: 1.08,
  }),
  center: {
    y: '0%',
    scale: 1,
    transition: {
      duration: 1.3,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    },
  },
  exit: (dir: number) => ({
    y: dir > 0 ? '-100%' : '100%',
    scale: 1,
    transition: {
      duration: 1.3,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    },
  }),
};

export default function Hero({
  slides: propSlides,
  autoPlayInterval = 6000,
}: HeroProps) {
  const [loadedSlides, setLoadedSlides] = useState<Slide[] | null>(null);
  const [current, setCurrent] = useState(0);
  const slides = propSlides ?? loadedSlides ?? [];
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (propSlides) { setLoadedSlides(propSlides); return; }
    let cancelled = false;
    fetchHeroSlides().then((data) => {
      if (!cancelled && data.length > 0) setLoadedSlides(data);
    });
    return () => { cancelled = true; };
  }, [propSlides]);

  const totalSlides = slides.length;

  const goTo = useCallback(
    (index: number, dir?: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setDirection(dir ?? (index > current ? 1 : -1));
      setCurrent((index + totalSlides) % totalSlides);
      setTimeout(() => setIsAnimating(false), 1400);
    },
    [isAnimating, current, totalSlides],
  );

  const next = useCallback(() => {
    goTo(current + 1, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo(current - 1, -1);
  }, [current, goTo]);

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    autoPlayRef.current = setInterval(next, autoPlayInterval);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, next, autoPlayInterval, totalSlides]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartRef.current === null) return;
      const diff = touchStartRef.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
      }
      touchStartRef.current = null;
    },
    [next, prev],
  );

  if (totalSlides === 0) return null;

  return (
    <section
              className="relative w-full min-h-[75dvh] sm:min-h-[75vh] overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Hero carousel"
      aria-roledescription="carousel"
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 will-change-transform"
        >
          <HeroImage
            src={slides[current].image}
            srcMobile={slides[current].imageMobile}
            alt={slides[current].alt}
            priority={current === 0}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/18 z-10" />

      <div
        className="absolute z-20 flex flex-col items-center px-6 text-center"
        style={{ top: '58%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <AnimatePresence mode="wait">
          <HeroContent
            key={`text-${current}`}
            title={slides[current].title}
            subtitle={slides[current].subtitle}
          />
        </AnimatePresence>
        <div className="relative z-20 mt-10 flex items-center gap-4">
          <Link
            href="/products"
            className="relative text-white text-base font-semibold tracking-widest uppercase cursor-pointer bg-transparent border-none p-0 pb-px group"
          >
            <span className="relative inline-block">
              Shop Collection
              <span className="absolute -bottom-px left-0 w-0 h-[1px] bg-white transition-all duration-300 ease-out origin-left group-hover:w-full" />
            </span>
          </Link>
          <span className="text-white/40 select-none text-base leading-none">|</span>
          <Link
            href="/products"
            className="relative text-white text-base font-semibold tracking-widest uppercase cursor-pointer bg-transparent border-none p-0 pb-px group"
          >
            <span className="relative inline-block">
              Shop All Items
              <span className="absolute -bottom-px left-0 w-0 h-[1px] bg-white transition-all duration-300 ease-out origin-left group-hover:w-full" />
            </span>
          </Link>
        </div>
      </div>

      {totalSlides > 1 && (
        <>
          <div className="absolute bottom-10 left-6 md:left-10 z-20 flex items-center gap-4">
            <button
              type="button"
              onClick={prev}
              className="p-1.5 bg-transparent text-white/60 hover:text-white transition-colors duration-300"
              aria-label="Previous slide"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="15,4 7,12 15,20" />
              </svg>
            </button>
<button
              type="button"
              onClick={next}
              className="p-1.5 bg-transparent text-white/60 hover:text-white transition-colors duration-300"
              aria-label="Next slide"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="9,4 17,12 9,20" />
              </svg>
            </button>
          </div>
          <HeroProgress
            total={totalSlides}
            current={current}
            isPaused={isPaused}
            duration={autoPlayInterval}
          />
        </>
      )}
    </section>
  );
}
