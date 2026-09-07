'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { HeroImage } from './HeroImage';
import { HeroContent } from './HeroContent';
import { HeroProgress } from './HeroProgress';
import { fetchHeroSlides } from './utils/api';
import type { Slide } from './types';

const slideVariants = {
  enter: {
    opacity: 0,
    scale: 1.05,
  },
  center: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.5,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    scale: 1,
    transition: {
      duration: 1.5,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

export default function Hero({
  autoPlayInterval = 2000,
}: {
  autoPlayInterval?: number;
}) {
  const [loadedSlides, setLoadedSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const slides = loadedSlides;
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartRef = useRef<number | null>(null);

  useEffect(() => {
    fetchHeroSlides().then((data) => {
      if (data.length > 0) setLoadedSlides(data);
    });
  }, []);

  const totalSlides = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent((index + totalSlides) % totalSlides);
      setTimeout(() => setIsAnimating(false), 1600);
    },
    [isAnimating, current, totalSlides],
  );

  const next = useCallback(() => {
    goTo(current + 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo(current - 1);
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
              className="relative w-full min-h-[60dvh] sm:min-h-[65vh] overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Hero carousel"
      aria-roledescription="carousel"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 will-change-[opacity]"
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
        className="absolute z-20 flex flex-col items-center px-6 sm:px-10 lg:px-16 max-w-7xl text-center"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <AnimatePresence mode="wait">
          <HeroContent
            key={`text-${current}`}
            title={slides[current].title}
            subtitle={slides[current].subtitle}
          />
        </AnimatePresence>

      </div>

      {totalSlides > 1 && (
        <HeroProgress
          total={totalSlides}
          current={current}
          isPaused={isPaused}
          duration={autoPlayInterval}
        />
      )}

      <Link
        href="/products"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 text-white px-7 py-3 rounded-xs font-semibold text-sm sm:text-base uppercase tracking-wider bg-transparent hover:bg-white hover:text-zinc-600 transition-all duration-300"
      >
        Shop Collection
      </Link>
    </section>
  );
}
