'use client';

import { memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ThreeImageGridColumn } from '../types';

interface ThreeImageGridClientProps {
  columns: ThreeImageGridColumn[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function ProductOverlayCard({ product }: { product: NonNullable<ThreeImageGridColumn['product']> }) {
  return (
    <Link
      href={product.link}
      className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-white p-3 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex gap-2">
        <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden bg-zinc-50">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <h4 className="text-[10px] font-medium text-zinc-900 truncate leading-tight">
            {product.name}
          </h4>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs font-semibold text-zinc-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-zinc-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ThreeImageGridClientComponent({ columns }: ThreeImageGridClientProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
      {columns.map((col, i) => (
        <motion.div
          key={col.image.id}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
          className="relative aspect-[3/4] overflow-hidden group"
        >
          <Link href={col.image.link || '#'} className="block w-full h-full">
            {col.image.src && (
              <img
                src={col.image.src}
                alt={col.image.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          </Link>

          {col.product && <ProductOverlayCard product={col.product} />}
        </motion.div>
      ))}
    </div>
  );
}

export const ThreeImageGridClient = memo(ThreeImageGridClientComponent);
