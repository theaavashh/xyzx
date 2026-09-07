'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, ExternalLink, ImageIcon, Plus, X, XCircle } from 'lucide-react';
import type { SalesBanner } from '../types';

interface SalesBannerGridProps {
  banners: SalesBanner[];
  isLoading: boolean;
  onEdit: (banner: SalesBanner) => void;
  onToggle: (banner: SalesBanner) => void;
  onDelete: (banner: SalesBanner) => void;
  onReorder: (bannerId: string, direction: 'up' | 'down') => void;
  onAdd: () => void;
}

export function SalesBannerGrid({ banners, isLoading, onEdit, onToggle, onDelete, onReorder, onAdd }: SalesBannerGridProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
          </div>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="p-6">
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sales banners</h3>
            <p className="text-gray-500 mb-4">Add your first sales banner to get started</p>
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#C4A030] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Banner
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="aspect-[16/9] bg-gray-100 relative">
                {banner.image ? (
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-contain" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-semibold text-lg">{banner.title}</h3>
                  {banner.subtitle && (
                    <p className="text-white/80 text-sm mt-0.5">{banner.subtitle}</p>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => onEdit(banner)}
                    className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggle(banner)}
                    className={`p-2 rounded-lg ${banner.isActive ? 'bg-white text-gray-700 hover:bg-gray-100' : 'bg-[#D4AF37] text-white hover:bg-[#C4A030]'}`}
                    title={banner.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {banner.isActive ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(banner)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    title="Delete"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute top-2 left-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => onReorder(banner.id, 'up')}
                    disabled={index === 0}
                    className="p-1 bg-black/50 text-white rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/70"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onReorder(banner.id, 'down')}
                    disabled={index === banners.length - 1}
                    className="p-1 bg-black/50 text-white rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/70"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    {banner.buttonText && (
                      <span className="text-sm font-medium text-gray-900">{banner.buttonText}</span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {banner.buttonUrl && (
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
