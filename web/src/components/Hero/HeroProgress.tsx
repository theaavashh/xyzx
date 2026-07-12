'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

interface HeroProgressProps {
  total: number;
  current: number;
  isPaused: boolean;
  duration: number;
}

function HeroProgressComponent({ total, current, isPaused, duration }: HeroProgressProps) {
  return (
    <div className="absolute bottom-20 right-8 md:right-10 z-30 hidden md:flex flex-col items-center gap-4">
      <div className="relative w-[1px] h-[120px] bg-white/25">
        <motion.div
          key={`progress-${current}`}
          className="absolute bottom-0 left-0 w-full bg-white"
          initial={{ height: '0%' }}
          animate={{
            height: '100%',
            transition: {
              duration: duration / 1000,
              ease: 'linear',
            },
          }}
          style={{ originY: 1 }}
        />
      </div>

      <motion.div
        className="flex flex-col items-center gap-1"
        animate={{ y: [0, 6, 0] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg
          width="12"
          height="20"
          viewBox="0 0 12 20"
          fill="none"
          stroke="white"
          strokeWidth="1"
          aria-hidden="true"
        >
          <line x1="6" y1="0" x2="6" y2="14" />
          <polyline points="2,10 6,14 10,10" />
        </svg>
      </motion.div>
    </div>
  );
}

export const HeroProgress = memo(HeroProgressComponent);
