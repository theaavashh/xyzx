'use client';

import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  Edit3,
  ImageIcon,
  Link2,
  Video,
} from 'lucide-react';
import type { HeroBanner } from '../types';

interface HeroBannerGridProps {
  banners: HeroBanner[];
  isLoading: boolean;
  onEdit: (banner: HeroBanner) => void;
  onToggle: (banner: HeroBanner) => void;
  onDelete: (banner: HeroBanner) => void;
  onReorder: (id: string, dir: 'up' | 'down') => void;
  onPreview: (url: string) => void;
}

export function HeroBannerGrid({
  banners,
  isLoading,
  onEdit,
  onToggle,
  onDelete,
  onReorder,
  onPreview,
}: HeroBannerGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl overflow-hidden animate-pulse"
          >
            <div className="h-72 bg-white" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
              <div className="h-6 bg-gray-100 rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 mb-4">No hero banners yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {banners.map((banner, idx) => (
        <motion.div
          key={banner.id}
          whileHover={{ y: -1 }}
          transition={{ duration: 0.15 }}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden group"
        >
          <div className="relative h-72 bg-white">
            {banner.videoUrl ? (
              <div
                className="w-full h-full cursor-pointer"
                onClick={() => onPreview(banner.videoUrl!)}
              >
                <video
                  src={banner.videoUrl}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full grid grid-cols-2 gap-px">
                {banner.largeImage ? (
                  <button
                    type="button"
                    onClick={() => onPreview(banner.largeImage!)}
                    className="relative overflow-hidden bg-white"
                  >
                    <img
                      src={banner.largeImage}
                      alt=""
                      className="w-full h-full object-contain"
                      crossOrigin="anonymous"
                    />
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                      Desktop
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center justify-center bg-gray-50">
                    <ImageIcon className="w-5 h-5 text-gray-300" />
                  </div>
                )}
                {banner.smallImage ? (
                  <button
                    type="button"
                    onClick={() => onPreview(banner.smallImage!)}
                    className="relative overflow-hidden bg-white"
                  >
                    <img
                      src={banner.smallImage}
                      alt=""
                      className="w-full h-full object-contain"
                      crossOrigin="anonymous"
                    />
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                      Mobile
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center justify-center bg-gray-50">
                    <ImageIcon className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </div>
            )}
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-0.5 rounded">
              #{banner.order}
            </div>
            <div className="absolute top-2 right-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  banner.isActive
                    ? 'bg-emerald-500/90 text-white border-emerald-400/30'
                    : 'bg-gray-500/90 text-white border-gray-400/30'
                }`}
              >
                {banner.isActive ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="text-xs text-gray-500 truncate">
                    {banner.subtitle}
                  </p>
                )}
              </div>
            </div>
            {banner.buttonText && (
              <div className="inline-flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-xs text-gray-600 border border-gray-200 mb-3">
                <Link2 className="w-3 h-3" />
                {banner.buttonText}
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex gap-0.5">
                <button
                  type="button"
                  onClick={() => onReorder(banner.id, 'up')}
                  disabled={idx === 0}
                  className="p-1 text-gray-400 hover:text-gray-900 rounded disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onReorder(banner.id, 'down')}
                  disabled={idx === banners.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-900 rounded disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(banner)}
                  className="px-2.5 py-1 text-xs font-medium text-[#D4AF37] bg-[#D4AF37]/10 rounded-md hover:bg-[#D4AF37]/20 transition-colors"
                >
                  <Edit3 className="w-3 h-3 inline mr-1" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onToggle(banner)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    banner.isActive
                      ? 'text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20'
                      : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {banner.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(banner)}
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
