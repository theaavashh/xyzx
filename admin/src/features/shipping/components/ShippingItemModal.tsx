'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ShippingItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item?: ShippingItem | null;
  itemType: 'method' | 'info' | 'region';
  onSubmit: (payload: Partial<ShippingItem>) => Promise<void>;
  isSubmitting: boolean;
}

export function ShippingItemModal({ isOpen, onClose, item, itemType, onSubmit, isSubmitting }: Props) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [region, setRegion] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [time, setTime] = useState('');
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const typeLabel = itemType === 'method' ? 'Method' : itemType === 'info' ? 'Info' : 'Region';

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setTitle(item.title || '');
      setRegion(item.region || '');
      setDescription(item.description || '');
      setPrice(item.price || '');
      setTime(item.time || '');
      setOrder(item.order);
      setIsActive(item.isActive);
    } else {
      setName('');
      setTitle('');
      setRegion('');
      setDescription('');
      setPrice('');
      setTime('');
      setOrder(0);
      setIsActive(true);
    }
  }, [item, isOpen, itemType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<ShippingItem> = {
      type: itemType,
      order,
      isActive,
      description: description || undefined,
      price: itemType !== 'info' ? price : undefined,
      time: itemType !== 'info' ? time : undefined,
    };
    if (itemType === 'method') payload.name = name || undefined;
    if (itemType === 'info') payload.title = title || undefined;
    if (itemType === 'region') payload.region = region || undefined;
    onSubmit(payload);
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-black">{item ? `Edit ${typeLabel}` : `Create ${typeLabel}`}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-black"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {itemType === 'method' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Standard Shipping" required />
                </div>
              )}

              {itemType === 'info' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Order Processing" required />
                </div>
              )}

              {itemType === 'region' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Region *</label>
                  <input value={region} onChange={(e) => setRegion(e.target.value)} className={inputClass} placeholder="Europe" required />
                </div>
              )}

              {itemType !== 'info' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} placeholder="$12.99" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} placeholder="3-5 days" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputClass + ' resize-none'} placeholder="Brief description" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} min={0} className={inputClass} />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]" />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-black bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#b8962e] disabled:opacity-50 text-sm">
                  {isSubmitting ? 'Saving...' : item ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
