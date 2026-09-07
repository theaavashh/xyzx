'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, itemCount, subtotal, isLoading, updateQuantity, removeItem } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 250 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#fcfbf9] z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[rgb(209,205,196)]">
              <h3 className="swansea text-2xl text-[#212121] flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
                Cart {itemCount > 0 && <span className="inline-flex items-center justify-center ml-1.5 text-sm font-medium">{itemCount}</span>}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:opacity-60 transition-opacity"
                aria-label="Close cart"
              >
                <X className="h-5 w-5 text-[#212121]" strokeWidth={1.5} />
              </button>
            </div>

            {items.length > 0 && (
              <div className="px-6 pt-5 pb-2">
                <p className="text-xs text-zinc-600 mb-2">
                  {subtotal >= 100 ? (
                    <>You've got <span className="font-semibold">free shipping!</span></>
                  ) : (
                    <>Only <span className="font-semibold">${(100 - subtotal).toFixed(2)}</span> away from free shipping</>
                  )}
                </p>
                <div className="w-full bg-gray-200 h-1.5">
                  <div
                    className="bg-green-600 h-1.5 transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#212121]/20 border-t-[#212121]" />
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 flex items-center justify-center mb-6">
                    <ShoppingBag className="h-7 w-7 text-[#212121]" strokeWidth={1} />
                  </div>
                  <p className="text-lg font-semibold text-zinc-600 uppercase tracking-wide mb-1">
                    Your Cart is Empty
                  </p>
                  <p className="text-base text-[#212121]/60 mb-8 max-w-[350px]">
                    Discover our collection and find your perfect piece.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3.5 bg-[#212121] text-white text-base font-medium uppercase tracking-widest hover:bg-[#212121]/90 transition-colors"
                  >
                    Shop
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.filter(Boolean).map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4"
                    >
                      <div className="relative w-20 h-24 bg-white flex-shrink-0 border border-[rgb(209,205,196)]">
                        {item.image ? (
                          <Image
                            src={
                              item.image.startsWith('http')
                                ? item.image
                                : `${API_BASE_URL}${item.image}`
                            }
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#fcfbf9] flex items-center justify-center">
                            <ShoppingBag className="h-5 w-5 text-[rgb(209,205,196)]" strokeWidth={1} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-base font-medium text-[#212121] leading-tight">
                              {item.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="p-0.5 hover:opacity-60 transition-opacity flex-shrink-0"
                              aria-label="Remove item"
                            >
                              <X className="h-4 w-4 text-[#212121]/50" strokeWidth={1.5} />
                            </button>
                          </div>
                          {(item.size || item.color) && (
                            <p className="text-sm text-[#212121]/60 mt-0.5">
                              {item.size && `Size: ${item.size}`}
                              {item.size && item.color && ' / '}
                              {item.color && `Color: ${item.color}`}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-[rgb(209,205,196)]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="px-2.5 py-1.5 text-[#212121] hover:bg-black/5 transition-colors disabled:opacity-30"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                            <span className="px-4 py-1.5 text-sm font-medium text-[#212121] min-w-[1.5rem] text-center border-x border-[rgb(209,205,196)]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2.5 py-1.5 text-[#212121] hover:bg-black/5 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                          </div>
                          <p className="text-base font-medium text-[#212121]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-[rgb(209,205,196)] px-6 py-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base text-[#212121]/70">Subtotal</span>
                  <span className="text-base font-semibold text-[#212121]">${subtotal.toFixed(2)}</span>
                </div>

                <p className="text-sm text-[#212121]/50 text-center italic leading-relaxed">
                  Shipping, taxes, and discount codes are calculated at checkout
                </p>

                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full py-3.5 bg-[#212121] text-white text-base font-medium uppercase tracking-widest text-center hover:bg-[#212121]/90 transition-colors"
                >
                  Check Out
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  className="block w-full py-3.5 border border-[#212121] text-[#212121] text-base font-medium uppercase tracking-widest text-center hover:bg-[#212121] hover:text-white transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
