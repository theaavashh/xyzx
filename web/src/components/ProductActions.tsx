/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/data/products';

interface ProductActionsProps {
  product: Product;
  selectedColor?: string;
  onColorChange?: (color: string) => void;
  onSizeGuideOpen?: () => void;
}

export default function ProductActions({
  product,
  selectedColor,
  onColorChange,
  onSizeGuideOpen,
}: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [openAccordion, setOpenAccordion] = useState<string>('');

  // Use external color if provided, otherwise use internal state
  const [internalSelectedColor, setInternalSelectedColor] = useState<string>(
    selectedColor || '',
  );
  const currentColor =
    selectedColor !== undefined ? selectedColor : internalSelectedColor;

  const handleColorSelect = (color: string) => {
    if (onColorChange) {
      onColorChange(color);
    } else {
      setInternalSelectedColor(color);
    }
  };

  // Map hex colors to color names
  const colorNameMap: { [key: string]: string } = {
    '#000000': 'Black',
    '#FFFFFF': 'White',
    '#808080': 'Gray',
    '#FFC0CB': 'Pink',
    '#87CEEB': 'Sky Blue',
    '#98FB98': 'Pale Green',
    '#FF0000': 'Red',
    '#0000FF': 'Blue',
    '#FFFF00': 'Yellow',
    '#008000': 'Green',
    '#FFA500': 'Orange',
    '#800080': 'Purple',
    '#A52A2A': 'Brown',
    '#C0C0C0': 'Silver',
    '#FFD700': 'Gold',
    '#00FF00': 'Lime',
    '#00FFFF': 'Cyan',
    '#FF00FF': 'Magenta',
    '#F5F5DC': 'Beige',
    '#FAEBD7': 'Antique White',
  };

  const getColorName = (hexColor: string): string => {
    // Try exact match first
    if (colorNameMap[hexColor]) {
      return colorNameMap[hexColor];
    }

    // Try case-insensitive match
    const normalizedHex = hexColor.toUpperCase();
    if (colorNameMap[normalizedHex]) {
      return colorNameMap[normalizedHex];
    }

    // Return the hex if no name found
    return hexColor;
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? '' : id);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    if (!selectedColor) {
      alert('Please select a color');
      return;
    }
    alert('Product added to bag!');
  };

  const handleFavorite = () => {
    alert('Added to favorites');
  };

  const openSizeGuide = () => {
    if (onSizeGuideOpen) {
      onSizeGuideOpen();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-medium text-black">
          {product.name}
        </h1>
        <p className=" text-gray-500 mt-1 font-normal">{product.category}</p>
        <div className="mt-4">
          <p className="text-3xl general-sans text-gray-900">
            ${product.price.toFixed(0)}
          </p>
          {product.originalPrice > product.price && (
            <p className="text-lg text-gray-500 line-through mt-1">
              ${product.originalPrice.toFixed(0)}
            </p>
          )}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium text-gray-500">
            {currentColor
              ? `Color: ${getColorName(currentColor)}`
              : 'Select Color'}
          </span>
          <button
            type="button"
            onClick={openSizeGuide}
            className="text-base text-gray-500 hover:text-gray-800"
          >
            Size Guide
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {product.colorOptions.map((color, index) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorSelect(color)}
              className={`flex flex-col items-center gap-2 rounded-lg transition-all ${
                currentColor === color ? 'bg-gray-100 ' : 'hover:bg-gray-50'
              }`}
              aria-label={`Select ${getColorName(color)} color`}
            >
              {/* Color Image */}
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={product.images[index % product.images.length]}
                  alt={`${product.name} in ${getColorName(color)}`}
                  className="w-full h-full object-cover"
                />
                {/* Color overlay indicator */}
              </div>
              {/* Color Name */}
              <span
                className={`text-xs font-medium ${
                  currentColor === color ? 'text-black' : 'text-gray-600'
                }`}
              >
                {getColorName(color)}
              </span>
            </button>
          ))}
        </div>
        {!selectedColor && (
          <p className="text-xs text-red-500 mt-2 hidden">
            Please select a color.
          </p>
        )}
      </div>

      {/* Size Selection */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-base font-medium text-gray-500">
            {selectedSize ? `Size: ${selectedSize}` : 'Select Size'}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`py-3 border rounded-md text-base ${
                selectedSize === size
                  ? 'border-black text-gray-500'
                  : 'border-gray-200 text-gray-900 hover:border-gray-800'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        {!selectedSize && (
          <p className="text-xs text-red-500 mt-2 hidden">
            Please select a size.
          </p>
        )}
      </div>

      {/* Klarna / Payment Info Placeholder */}
      <div className="text-md text-gray-500">
        <p>
          Reward point of{' '}
          <span className="font-bold">{(product.price / 4).toFixed(0)}</span>{' '}
          with purchase of this <span className="font-bold">Product</span>.{' '}
          <Link href="#" className="underline">
            Learn More
          </Link>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          className="w-full bg-black text-white py-4 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
        >
          Add to Bag
        </button>
        <button
          onClick={handleFavorite}
          className="w-full border border-gray-300 text-gray-900 py-4 rounded-full text-base font-medium hover:border-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          Favorite
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Shipping Info */}
      <div className="text-sm text-gray-500 space-y-2 pt-4">
        <p className="font-medium text-gray-900">Shipping</p>
        <p>You'll see our shipping options at checkout.</p>
        <div className="space-y-1 pt-2">
          <p className="underline cursor-pointer hover:text-gray-800">
            Return Policy
          </p>
          <p className="underline cursor-pointer hover:text-gray-800">
            Free 7 days return
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="pt-6 text-base text-gray-900 leading-relaxed font-light">
        <p>{product.description}</p>
        <ul className="list-disc pl-5 mt-4 space-y-1">
          {product.features?.slice(0, 3).map((feature, i) => (
            <li key={i} className="pl-2">
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Accordions */}
      <div className="border-t border-gray-200 pt-2">
        {[
          {
            id: 'reviews',
            title: `Reviews (${product.reviews})`,
            content: 'Reviews content placeholder.',
          },
          {
            id: 'shipping',
            title: 'Shipping & Returns',
            content: 'Free standard shipping on orders over $50.',
          },
          {
            id: 'sizeFit',
            title: 'Size & Fit',
            content: 'Model is wearing size M.',
          },
        ].map((section) => (
          <div key={section.id} className="border-b border-gray-200">
            <button
              onClick={() => toggleAccordion(section.id)}
              className="flex justify-between items-center w-full py-6 text-left group"
            >
              <span className="text-lg font-medium text-gray-900 group-hover:text-gray-600">
                {section.title}
              </span>
              <svg
                className={`w-6 h-6 transform transition-transform ${
                  openAccordion === section.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openAccordion === section.id && (
              <div className="pb-6 text-base text-gray-500">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
