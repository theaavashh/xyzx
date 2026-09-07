'use client';

import { motion } from 'framer-motion';

export default function PageLoadBlur() {
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[200] pointer-events-none bg-white"
      initial={{ opacity: 1, backdropFilter: 'blur(28px)' }}
      animate={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
    />
  );
}