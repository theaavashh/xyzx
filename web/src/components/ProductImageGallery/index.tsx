import { useState } from 'react';
import type { Product } from '@/data/products';
import { ColorBadge } from './components/ColorBadge';
import { MainImage } from './components/MainImage';
import { MobileDots } from './components/MobileDots';
import { Thumbnail } from './components/Thumbnail';

interface ProductImageGalleryProps {
  product: Product;
  selectedColor?: string;
  colorImages?: { [color: string]: string[] };
}

export default function ProductImageGallery({
  product,
  selectedColor,
  colorImages,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleSelect = (index: number) => {
    setSelectedImage(index);
    setIsLoading(true);
    setHasError(false);
  };

  const getColorImages = (color: string): string[] => {
    if (!color || !colorImages) {
      return product.images;
    }
    return colorImages[color] || product.images;
  };

  const displayImages = selectedColor
    ? getColorImages(selectedColor)
    : product.images;

  const currentImage = displayImages[selectedImage] || displayImages[0] || '';

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      <Thumbnail
        images={displayImages}
        selectedIndex={selectedImage}
        productId={String(product.id)}
        productName={product.name}
        selectedColor={selectedColor}
        onSelect={handleSelect}
      />

      <div className="flex-1 relative">
        <MainImage
          src={currentImage}
          alt={`${product.name} ${selectedColor || ''} - view ${selectedImage + 1}`}
          priority={selectedImage === 0}
          isLoading={isLoading}
          hasError={hasError}
          onLoad={handleLoad}
          onError={handleError}
          fallbackText={`${product.name} image`}
        />

        <MobileDots
          count={displayImages.length}
          selectedIndex={selectedImage}
          productId={String(product.id)}
          onSelect={handleSelect}
        />

        {selectedColor && <ColorBadge color={selectedColor} />}
      </div>
    </div>
  );
}
