import { useState } from 'react';
import { Package } from 'lucide-react';
import BannerCard from './BannerCard';
import type { Banner } from '@/types/banner.types';

interface BannerListProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
  onToggle: (id: string) => void;
  isTogglingId?: string;
  bannerBackgroundColor?: string;
  bannerTextColor?: string;
}

const DEFAULT_BANNER_BG = '#F0F9FF';
const DEFAULT_BANNER_TEXT = '#1E40AF';

export default function BannerList({
  banners,
  onEdit,
  onDelete,
  onToggle,
  isTogglingId,
  bannerBackgroundColor = DEFAULT_BANNER_BG,
  bannerTextColor = DEFAULT_BANNER_TEXT,
}: BannerListProps) {
  if (banners.length === 0) {
    return (
      <div className="p-4 bg-white min-h-[60vh] flex justify-center items-center">
        <div className="text-center py-12">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-black" />
          </div>
          <h3 className="text-xl font-medium text-black mb-2">
            No banners created yet
          </h3>
          <p className="text-gray-600 text-xl mb-4">
            Create your first promotional banner to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {banners.map((banner) => (
          <BannerCard
            key={banner.id}
            banner={banner}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
            isToggling={isTogglingId === banner.id}
            bannerBackgroundColor={bannerBackgroundColor}
            bannerTextColor={bannerTextColor}
          />
        ))}
      </div>
    </div>
  );
}
