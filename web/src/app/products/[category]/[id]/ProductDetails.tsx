'use client';

import { useState } from 'react';
import ProductActions from '@/components/ProductActions';
import ProductImageGallery from '@/components/ProductImageGallery';
import SizeGuideModal from '@/components/SizeGuideModal';
import type { Product } from '@/data/products';

interface ProductDetailsProps {
  product: Product;
  rewardPoints: number;
}

export default function ProductDetails({
  product,
  rewardPoints,
}: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mt-10">
        {/* Left Column - Image Gallery */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 h-fit">
          <ProductImageGallery
            product={product}
            selectedColor={selectedColor}
          />
        </div>

        {/* Right Column - Product Details */}
        <div className="lg:col-span-5 space-y-8">
          <div className="lg:sticky lg:top-24 space-y-8">
            <ProductActions
              product={product}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              onSizeGuideOpen={() => setIsSizeGuideOpen(true)}
            />

            {/* Reward Points Section */}
            <div className="bg-[#f8f8f8] rounded-xl border border-gray-100  px-4 py-2 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-5">
                {/* Content */}
                <div className="flex-1">
                  {/* Points Display */}
                  <div className="mb-3">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-lg general-sans text-black">
                        Reward points
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium general-sans">
                      You'll earn{' '}
                      <span className="text-3xl font-bold text-gray-900">
                        {rewardPoints.toLocaleString()}
                      </span>{' '}
                      points with this purchase
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-700">
                        Progress
                      </span>
                      <span className="text-xs font-medium text-amber-600">
                        {Math.floor(rewardPoints / 100)}% to next tier
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((rewardPoints / 5000) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal - Rendered at top level */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        product={product}
      />
    </>
  );
}
