'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import type { Product } from '../types';

function resolveImageUrl(url?: string): string {
  if (!url) return '';
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `${BASE}${url}`;
}

const COLOR_NAME_MAP: Record<string, string> = {
  '#000000': 'Black',
  '#ffffff': 'White',
  '#FFFFFF': 'White',
  '#1a1a2e': 'Navy',
  '#1c3d5a': 'Blue',
  '#2d2d2d': 'Charcoal',
  '#8b4513': 'Brown',
  '#8B4513': 'Brown',
  '#d4af37': 'Gold',
  '#D4AF37': 'Gold',
  '#b22222': 'Red',
  '#2e4057': 'Dark Blue',
  '#f5f5dc': 'Beige',
  '#c0c0c0': 'Silver',
  '#556b2f': 'Olive',
  '#cd853f': 'Tan',
  '#2f4f4f': 'Dark Slate',
  '#dda0dd': 'Plum',
  '#8b0000': 'Dark Red',
  '#4682b4': 'Steel Blue',
  '#808080': 'Gray',
  '#FFC0CB': 'Pink',
  '#87CEEB': 'Sky Blue',
  '#98FB98': 'Pale Green',
};

interface QuickAddBottomSheetProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickAddBottomSheet({ product, isOpen, onClose }: QuickAddBottomSheetProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colorOptions?.[0] || '');
    }
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!product) return null;

  const handleAdd = () => {
    if (selectedSize && selectedColor) {
      console.log('Add to cart:', {
        productId: product.id,
        size: selectedSize,
        color: selectedColor,
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />

          <motion.div
            className="relative bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md md:mx-4 shadow-xl max-h-[85vh] overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
          >
            <div className="sticky top-0 bg-white flex justify-center pt-3 pb-1 border-b border-gray-100 z-10">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 pt-4 pb-6">
              <div className="flex gap-4 mb-6">
                <div className="w-20 h-20 relative flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  {product.image ? (
                    <Image src={resolveImageUrl(product.image)} alt={product.name} fill className="object-cover" sizes="80px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-xs">No img</div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-zinc-900 text-sm leading-tight">{product.name}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{product.category}</p>
                  <p className="text-lg font-bold text-zinc-900 mt-1.5">${product.price.toFixed(2)}</p>
                </div>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-5">
                  <p className="text-sm font-medium text-zinc-700 mb-2.5">
                    Size <span className="text-zinc-400 font-normal">— {selectedSize || 'Select'}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[48px] px-3 py-2 text-sm border rounded-lg transition-colors ${
                          selectedSize === size
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 text-zinc-700 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colorOptions && product.colorOptions.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-zinc-700 mb-2.5">
                    Color <span className="text-zinc-400 font-normal">— {selectedColor ? (COLOR_NAME_MAP[selectedColor] || selectedColor) : 'Select'}</span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.colorOptions.map((color, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? 'border-black scale-110 ring-2 ring-offset-2 ring-black'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={COLOR_NAME_MAP[color] || color}
                      />
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleAdd}
                disabled={!selectedSize || (!!product.colorOptions?.length && !selectedColor)}
                className="w-full py-3 text-sm font-semibold text-white bg-black rounded-full hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add to Cart — ${product.price.toFixed(2)}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
