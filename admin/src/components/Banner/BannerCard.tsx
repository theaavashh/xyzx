import { Calendar, Clock, Package, Star, XCircle } from 'lucide-react';
import type { Banner } from '@/types/banner.types';
import { sanitizeHtml } from '@/utils/sanitize';

interface BannerCardProps {
  banner: Banner;
  onEdit: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
  onToggle: (id: string) => void;
  isToggling?: boolean;
  bannerBackgroundColor?: string;
  bannerTextColor?: string;
}

const DEFAULT_BANNER_BG = '#C6E2E7';
const DEFAULT_BANNER_TEXT = '#1F2937';

export default function BannerCard({
  banner,
  onEdit,
  onDelete,
  onToggle,
  isToggling = false,
}: BannerCardProps) {
  const formattedDate = new Date(banner.createdAt).toLocaleDateString();
  const hasCountdown = !!banner.endDate;
  const hasButton = !!banner.buttonText;

  const bgColor = banner.backgroundColor || DEFAULT_BANNER_BG;
  const textColor = banner.textColor || DEFAULT_BANNER_TEXT;

  return (
    <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
      <div className="p-2">
        <div
          className="mb-4 rounded-md p-3"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          <div
            className="text-base font-medium line-clamp-2"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(banner.title) }}
          />
          <div className="flex items-center gap-3 mt-2 text-xs opacity-80">
            {hasCountdown && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Countdown
              </span>
            )}
            {hasButton && (
              <span className="font-semibold uppercase underline underline-offset-2">
                {banner.buttonText}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              banner.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {banner.isActive ? 'Active' : 'Inactive'}
          </span>
          <span className="text-xs text-black opacity-60">{formattedDate}</span>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onToggle(banner.id)}
            disabled={isToggling}
            className={`px-3 py-2 text-xs font-medium rounded-md transition-colors duration-200 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
              banner.isActive
                ? 'text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20'
                : 'text-green-600 bg-green-50 hover:bg-green-100'
            }`}
          >
            {isToggling ? (
              <span className="animate-spin">⏳</span>
            ) : banner.isActive ? (
              <>
                <Clock className="w-3 h-3" />
                Deactivate
              </>
            ) : (
              <>
                <Star className="w-3 h-3" />
                Activate
              </>
            )}
          </button>

          <button
            onClick={() => onEdit(banner)}
            className="flex-1 px-4 py-2 text-sm font-medium text-[#D4AF37] bg-[#D4AF37]/10 rounded-md hover:bg-[#D4AF37]/20 transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            <Package className="w-4 h-4" />
            Edit
          </button>

          <button
            onClick={() => onDelete(banner)}
            className="flex-1 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <XCircle className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
