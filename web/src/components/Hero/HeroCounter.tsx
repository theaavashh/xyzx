'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

interface HeroCounterProps {
  current: number;
  total: number;
}

function HeroCounterComponent({ current, total }: HeroCounterProps) {
  return (
    <div className="absolute bottom-10 left-6 md:left-10 z-30">
      <motion.span
        key={current}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="text-white/70 text-xs md:text-sm tracking-[0.2em] font-light tabular-nums"
      >
        {String(current + 1).padStart(2, '0')}
        <span className="mx-2 text-white/30">/</span>
        {String(total).padStart(2, '0')}
      </motion.span>
    </div>
  );
}

export const HeroCounter = memo(HeroCounterComponent);
