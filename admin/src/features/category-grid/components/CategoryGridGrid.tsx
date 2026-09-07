'use client';

import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  ImageIcon,
  Link as LinkIcon,
  Plus,
} from 'lucide-react';
import type { CategoryGridItem } from '../types';

interface CategoryGridGridProps {
  items: CategoryGridItem[];
  isLoading: boolean;
  onEdit: (item: CategoryGridItem) => void;
  onToggle: (item: CategoryGridItem) => void;
  onDelete: (item: CategoryGridItem) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
  onAdd: () => void;
}

export function CategoryGridGrid({
  items,
  isLoading,
  onEdit,
  onToggle,
  onDelete,
  onReorder,
  onAdd,
}: CategoryGridGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl overflow-hidden animate-pulse flex"
          >
            <div className="w-44 h-40 bg-gray-100 flex-shrink-0" />
            <div className="flex-1 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-5 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-48" />
              <div className="h-3 bg-gray-200 rounded w-32" />
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No category grid items found
        </h3>
        <p className="text-gray-600 mb-4">
          Get started by creating your first category grid item
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2.5 text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all font-semibold"
        >
          <Plus className="w-4 h-4" />
          Create Item
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden group flex hover:shadow-md transition-shadow"
        >
          <div className="relative w-44 h-40 bg-gray-100 flex-shrink-0">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-300" />
              </div>
            )}
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-0.5 rounded">
              #{item.order}
            </div>
            <div className="absolute top-2 right-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  item.isActive
                    ? 'bg-emerald-500/90 text-white border-emerald-400/30'
                    : 'bg-gray-500/90 text-white border-gray-400/30'
                }`}
              >
                {item.isActive ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
          </div>
          <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
              </div>
              {item.subtitle && (
                <p className="text-sm text-gray-500 mb-2 truncate">{item.subtitle}</p>
              )}
              {item.link && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span className="truncate max-w-md">{item.link}</span>
                </div>
              )}
              <div className="text-xs text-gray-400 mt-2">
                Created: {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100">
              <div className="flex gap-0.5">
                <button
                  type="button"
                  onClick={() => onReorder(item.id, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-20 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onReorder(item.id, 'down')}
                  disabled={index === items.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-900 disabled:opacity-20 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="px-2.5 py-1 text-xs font-medium text-[#D4AF37] bg-[#D4AF37]/10 rounded-md hover:bg-[#D4AF37]/20 transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onToggle(item)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    item.isActive
                      ? 'text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20'
                      : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {item.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
