'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

import type { DualCard } from '../types';

interface DualCardItemProps {
  card: DualCard;
  index: number;
}

export const DualCardItem = ({ card, index }: DualCardItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <Link href={card.link} className="block relative aspect-[4/5] overflow-hidden bg-gray-100">
        <Image
          src={card.src}
          alt={card.label}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="mt-4 text-center space-y-3">
        <h3 className={`text-2xl sm:text-3xl font-bold text-gray-900 lastik uppercase tracking-tight`}>
          {card.label}
        </h3>
        <Link
          href={card.link}
          className="inline-block border border-gray-900 px-6 py-2.5 text-sm font-medium tracking-wider text-gray-900 uppercase transition-all duration-300 hover:bg-gray-900 hover:text-white"
        >
          Discover
        </Link>
      </div>
    </motion.div>
  );
};
