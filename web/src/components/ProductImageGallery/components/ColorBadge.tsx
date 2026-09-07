import { memo } from 'react';

interface ColorBadgeProps {
  color: string;
}

export const ColorBadge = memo(function ColorBadge({ color }: ColorBadgeProps) {
  if (!color) {
    return null;
  }

  return (
    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
      <span className="text-sm font-medium text-zinc-600">{color}</span>
    </div>
  );
});
