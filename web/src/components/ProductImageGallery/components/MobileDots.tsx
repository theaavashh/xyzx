import { memo } from 'react';

interface MobileDotsProps {
  count: number;
  selectedIndex: number;
  productId: string;
  onSelect: (index: number) => void;
}

export const MobileDots = memo(function MobileDots({
  count,
  selectedIndex,
  productId,
  onSelect,
}: MobileDotsProps) {
  if (count <= 1) {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 lg:hidden">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={`dot-${productId}-${index}`}
          type="button"
          onClick={() => onSelect(index)}
          className={`w-2 h-2 rounded-full transition-colors ${
            index === selectedIndex ? 'bg-black' : 'bg-black/20'
          }`}
          aria-label={`Go to image ${index + 1}`}
        />
      ))}
    </div>
  );
});
