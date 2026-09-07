'use client';

import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  ImageIcon,
  Plus,
} from 'lucide-react';
import type { HeroSlide } from '../types';

interface HeroSlideGridProps {
  items: HeroSlide[];
  isLoading: boolean;
  onEdit: (item: HeroSlide) => void;
  onToggle: (item: HeroSlide) => void;
  onDelete: (item: HeroSlide) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
  onAdd: () => void;
}

export function HeroSlideGrid({
  items, isLoading, onEdit, onToggle, onDelete, onReorder, onAdd,
}: HeroSlideGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-5 bg-gray-200 rounded w-32" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
                <div className="h-16 w-16 bg-gray-200 rounded" />
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="h-8 w-8 bg-gray-200 rounded" />
                <div className="h-8 w-8 bg-gray-200 rounded" />
                <div className="h-8 w-8 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hero slides found</h3>
        <p className="text-gray-600 mb-4">Get started by creating your first hero slide</p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2.5 text-lg rounded-md hover:bg-[#b8962e] font-semibold"
        >
          <Plus className="w-4 h-4" />
          Create Slide
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {item.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Order: {item.order}</span>
              </div>

              <div className="flex items-center gap-4 mb-2">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-24 h-16 object-contain rounded border border-gray-200" crossOrigin="anonymous" />
                ) : null}
              </div>

              {item.subtitle && <p className="text-sm text-gray-500 mb-1">{item.subtitle}</p>}

              <div className="text-xs text-gray-500">Created: {new Date(item.createdAt).toLocaleDateString()}</div>
            </div>

            <div className="flex items-center gap-1">
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => onReorder(item.id, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-20" title="Move up"><ArrowUp className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => onReorder(item.id, 'down')} disabled={index === items.length - 1} className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-20" title="Move down"><ArrowDown className="w-3.5 h-3.5" /></button>
              </div>
              <div className="w-px h-6 bg-gray-200 mx-1" />
              <button type="button" onClick={() => onEdit(item)} className="px-2.5 py-1 text-xs font-medium text-[#D4AF37] bg-[#D4AF37]/10 rounded-md hover:bg-[#D4AF37]/20">Edit</button>
              <button type="button" onClick={() => onToggle(item)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md ${item.isActive ? 'text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}>
                {item.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button type="button" onClick={() => onDelete(item)} className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100">Delete</button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
