'use client';

import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';

interface HeroButtonsProps {
  onShopCollection: () => void;
  onShopAll: () => void;
}

const buttonVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as [number, number, number, number], delay: 0.4 },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

function HeroButtonsComponent({ onShopCollection, onShopAll }: HeroButtonsProps) {
  return (
    <motion.div
      variants={buttonVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-20 mt-10 flex items-center gap-4"
    >
      <HeroButton onClick={onShopCollection}>Shop Collection</HeroButton>
      <span className="text-white/40 select-none text-base leading-none">|</span>
      <HeroButton onClick={onShopAll}>Shop All Items</HeroButton>
    </motion.div>
  );
}

interface HeroButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

function HeroButton({ onClick, children }: HeroButtonProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onClick();
    },
    [onClick],
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative text-white text-base font-semibold tracking-widest uppercase cursor-pointer bg-transparent border-none p-0 pb-px group"
      aria-label={typeof children === 'string' ? children : 'Shop button'}
    >
      <span className="relative inline-block">
        {children}
        <span className="absolute -bottom-px left-0 w-0 h-[1px] bg-white transition-all duration-300 ease-out origin-left group-hover:w-full" />
      </span>
    </button>
  );
}

export const HeroButtons = memo(HeroButtonsComponent);
