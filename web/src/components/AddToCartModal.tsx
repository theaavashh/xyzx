'use client';

import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    price: number;
    image: string;
    variant?: string;
    brand?: string;
  };
  cartCount: number;
}

export default function AddToCartModal({
  isOpen,
  onClose,
  product,
  cartCount,
}: AddToCartModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-slide-down">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-600">
              ADDED TO CART
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-zinc-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Product Info */}
        <div className="mb-6">
          {product.brand && (
            <p className="text-sm font-medium text-zinc-600 mb-2">
              {product.brand}
            </p>
          )}

          <div className="flex gap-4">
            <div className="w-24 h-32 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-base font-medium text-zinc-600 mb-2">
                {product.name}
              </h3>
              <p className="text-lg font-semibold text-zinc-600 mb-2">
                Rs{product.price.toLocaleString('en-IN')}
              </p>
              {product.variant && (
                <p className="text-sm text-zinc-600">{product.variant}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/checkout"
            className="block w-full py-3 px-4 bg-black text-white text-center font-semibold rounded hover:bg-gray-800 transition-colors"
            onClick={onClose}
          >
            CHECKOUT ({cartCount})
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="block w-full py-3 px-4 border-2 border-black text-zinc-600 text-center font-semibold rounded hover:bg-gray-50 transition-colors"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
