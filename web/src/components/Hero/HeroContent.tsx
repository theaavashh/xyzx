'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

interface HeroContentProps {
  title: string;
  subtitle: string;
}

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.25,
    },
  },
};

const titleVariants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: {
      duration: 0.2,
    },
  },
};

const subtitleVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
      delay: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.2,
    },
  },
};

function HeroContentComponent({ title, subtitle }: HeroContentProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-20"
    >
      <motion.p
        variants={subtitleVariants}
        className="text-white/90 text-base font-normal mb-4"
       
      >
        {subtitle}
      </motion.p>
      <motion.h1
        variants={titleVariants}
        className="mt-4 text-5xl sm:text-6xl md:text-7xl lg:text-[60px] text-white leading-[1.05] tracking-[-0.03em] font-normal lastik"
       
      >
        {title}
      </motion.h1>
    </motion.div>
  );
}

export const HeroContent = memo(HeroContentComponent);
