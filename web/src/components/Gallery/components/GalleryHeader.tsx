import { memo } from 'react';

interface GalleryHeaderProps {
  title?: string;
  subtitle?: string;
}

export const GalleryHeader = memo(function GalleryHeader({
  title = 'Shop by Category',
  subtitle = 'Explore our curated collections for every style',
}: GalleryHeaderProps) {
  return (
    <header className="mb-8 px-4 md:px-16">
      <h2
        id="gallery-heading"
        className="text-3xl font-bold text-gray-900 mb-2"
      >
        {title}
      </h2>
      <p className="text-gray-500">{subtitle}</p>
    </header>
  );
});
