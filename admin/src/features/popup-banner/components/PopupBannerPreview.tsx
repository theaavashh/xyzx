'use client';

import { Image as ImageIcon } from 'lucide-react';

interface PopupBannerPreviewProps {
  image: string;
  size: 'small' | 'medium' | 'large';
}

export function PopupBannerPreview({ image, size }: PopupBannerPreviewProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Banner Preview
      </h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="max-w-md mx-auto">
          {image ? (
            <div className="relative">
              <img
                src={image}
                alt="Banner preview"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                {size.toUpperCase()}
              </div>
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
