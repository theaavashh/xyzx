import Image from 'next/image';
import { memo } from 'react';

interface ThumbnailProps {
  images: string[];
  selectedIndex: number;
  productId: string;
  productName: string;
  selectedColor?: string;
  onSelect: (index: number) => void;
}

export const Thumbnail = memo(function Thumbnail({
  images,
  selectedIndex,
  productId,
  productName,
  selectedColor,
  onSelect,
}: ThumbnailProps) {
  if (images.length <= 1) {
    return null;
  }

  return (
    <div className="flex lg:flex-col space-x-4 lg:space-x-0 lg:space-y-4 overflow-x-auto lg:overflow-visible py-2 lg:py-0 no-scrollbar">
      {images.map((image, index) => (
        <button
          key={`thumb-${productId}-${index}-${selectedColor || 'default'}`}
          type="button"
          onMouseEnter={() => onSelect(index)}
          onClick={() => onSelect(index)}
          className={`relative flex-shrink-0 w-16 h-16 lg:w-16 lg:h-16 rounded-md overflow-hidden border transition-all ${
            index === selectedIndex
              ? 'border-black opacity-100'
              : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'
          }`}
          aria-label={`View image ${index + 1}`}
        >
          <Image
            src={image}
            alt={`${productName} ${selectedColor || ''} thumbnail ${index + 1}`}
            fill
            className="object-cover"
            sizes="64px"
          />
        </button>
      ))}
    </div>
  );
});
