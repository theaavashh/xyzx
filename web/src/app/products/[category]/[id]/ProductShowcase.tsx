"use client";

import { useState } from "react";
import { Star, ShoppingCart, Truck, Shield, Package, ChevronDown, Ruler, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface Variant {
  color?: string;
  size?: string;
  pattern?: string;
  price?: number;
  sku?: string;
  quantity?: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  discountPercent: number | null;
  quantity: number;
  images: string[] | null;
  thumbnail: string | null;
  videos: string[] | null;
  isNew: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  material: string | null;
  season: string | null;
  variantAttributes: string[] | null;
  selectedSizes: string[] | null;
  selectedColors: string[] | null;
  variants: Variant[] | null;
  rating?: number;
  reviewsCount?: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9999";

const COLOR_MAP: Record<string, string> = {
  Black: "#1a1a1a", White: "#f5f5f5", Navy: "#1a2744", Red: "#d32f2f",
  Olive: "#556b2f", Grey: "#808080", Beige: "#d4c5a9", Burgundy: "#800020",
  Teal: "#008080", Charcoal: "#36454f",
};

function getColorHex(color: string): string {
  return COLOR_MAP[color] || color.toLowerCase();
}

function resolveImage(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
}

function Accordion({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-lg font-semibold text-gray-900">{title}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[2000px] pb-5" : "max-h-0"}`}>
        {children}
      </div>
    </div>
  );
}

export default function ProductShowcase({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const variantAttrs = (product.variantAttributes || []) as unknown as Array<{
    id: string; name: string; type: string;
    options: Array<{ id: string; name: string; value: string; color?: string }>
  }>;
  const colorAttr = variantAttrs.find(a => a.id === "color" || a.type === "color");
  const sizeAttr = variantAttrs.find(a => a.id === "size" || a.type === "size");
  const patternAttr = variantAttrs.find(a => a.id === "pattern" || a.type === "pattern");
  const extractedColors = colorAttr?.options?.map(o => o.name) || [];
  const extractedSizes = sizeAttr?.options?.map(o => o.name) || [];
  const extractedPatterns = patternAttr?.options?.map(o => o.name) || [];
  const colorHexMap = new Map((colorAttr?.options || []).map(o => [o.name, o.color || ""]));
  const colorByIdMap = new Map((colorAttr?.options || []).map(o => [o.id, o.name]));
  const sizeByIdMap = new Map((sizeAttr?.options || []).map(o => [o.id, o.name]));
  const patternByIdMap = new Map((patternAttr?.options || []).map(o => [o.id, o.name]));

  const displayColors = product.selectedColors && product.selectedColors.length > 0 ? product.selectedColors : extractedColors;
  const displaySizes = product.selectedSizes && product.selectedSizes.length > 0 ? product.selectedSizes : extractedSizes;

  const [selectedColor, setSelectedColor] = useState<string>(displayColors[0] || "");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedPattern, setSelectedPattern] = useState<string>("");
  const [currentImage, setCurrentImage] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const handleAddToCart = () => {
    addToCart(
      product.id,
      1,
      selectedSize || undefined,
      selectedColor || undefined
    );
  };

  const allImages: string[] = [];
  if (product.images && product.images.length > 0) {
    allImages.push(...product.images);
  } else if (product.thumbnail) {
    allImages.push(product.thumbnail);
  }

  const hasColorVariants = displayColors.length > 0;
  const hasSizeVariants = displaySizes.length > 0;
  const hasPatternVariants = extractedPatterns.length > 0;

  const filteredSizes = hasSizeVariants && selectedColor
    ? [...new Set((product.variants || []).map(v => ({
        color: colorByIdMap.get(v.color || '') || v.color || '',
        size: sizeByIdMap.get(v.size || '') || v.size || '',
        pattern: patternByIdMap.get(v.pattern || '') || v.pattern || ''
      })).filter(v => v.color === selectedColor).map(v => v.size))]
    : displaySizes;

  const selectedVariant = selectedColor && selectedSize
    ? (product.variants || []).find(v => {
        const vColor = colorByIdMap.get(v.color || '') || v.color || '';
        const vSize = sizeByIdMap.get(v.size || '') || v.size || '';
        const vPattern = patternByIdMap.get(v.pattern || '') || v.pattern || '';
        return vColor === selectedColor && vSize === selectedSize && (!selectedPattern || vPattern === selectedPattern);
      })
    : null;

  const displayPrice = selectedVariant?.price ?? product.price;
  const hasDiscount = product.discountPercent && product.discountPercent > 0;
  const rewardPoints = Math.floor(displayPrice * 10);
  const avgRating = product.rating ?? 0;
  const reviewCount = product.reviewsCount ?? 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div className="space-y-4">
        <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
          {allImages.length > 0 ? (
            <img src={resolveImage(allImages[currentImage] || allImages[0])} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300"><ShoppingCart className="w-20 h-20" /></div>
          )}
          {product.isOnSale && product.discountPercent && (
            <span className="absolute top-4 left-4 bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-md">-{product.discountPercent}%</span>
          )}
        </div>
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {allImages.map((img, i) => (
              <button key={i} type="button" onClick={() => setCurrentImage(i)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${i === currentImage ? "border-[#D4AF37]" : "border-gray-200 hover:border-gray-400"}`}>
                <img src={resolveImage(img)} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="lastik text-3xl text-gray-900">{product.name}</h1>
          {product.material && <p className="text-base text-gray-500 mt-1 capitalize">{product.material}</p>}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-4 h-4 ${star <= Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500">{avgRating > 0 ? `${avgRating.toFixed(1)} (${reviewCount} reviews)` : "0 reviews"}</span>
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-gray-900">${displayPrice.toFixed(2)}</span>
          {hasDiscount && product.originalPrice && (
            <>
              <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
              <span className="text-base text-red-600 font-medium">Save ${(product.originalPrice - displayPrice).toFixed(2)}</span>
            </>
          )}
        </div>

        <hr className="border-gray-200" />

        {/* Color Variants */}
        {hasColorVariants && displayColors.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Color: <span className="font-normal text-gray-600 normal-case">{selectedColor}</span></h3>
            <div className="flex flex-wrap gap-3">
              {displayColors.map((color) => (
                <button key={color} type="button" onClick={() => { setSelectedColor(color); setSelectedSize(""); }}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/30" : "border-gray-300 hover:border-gray-500"}`}
                  style={{ backgroundColor: colorHexMap.get(color) || getColorHex(color) }} title={color} aria-label={color} />
              ))}
            </div>
          </div>
        )}

        {/* Pattern Variants */}
        {hasPatternVariants && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Pattern: <span className="font-normal text-gray-600 normal-case">{selectedPattern || "Select"}</span></h3>
            <div className="flex flex-wrap gap-2">
              {extractedPatterns.map((pattern) => (
                <button key={pattern} type="button" onClick={() => setSelectedPattern(selectedPattern === pattern ? "" : pattern)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${selectedPattern === pattern ? "border-[#D4AF37] bg-[#D4AF37] text-white" : "border-gray-300 text-gray-700 hover:border-gray-500"}`}>
                  {pattern}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Variants */}
        {hasSizeVariants && filteredSizes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Size: <span className="font-normal text-gray-600 normal-case">{selectedSize || "Select"}</span></h3>
              <button type="button" onClick={() => setShowSizeGuide(true)}
                className="text-xs text-[#D4AF37] hover:underline font-medium flex items-center gap-1">
                <Ruler className="w-3 h-3" /> Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredSizes.map((size) => (
                <button key={size} type="button" onClick={() => setSelectedSize(size || "")}
                  className={`min-w-[44px] px-4 py-2 rounded-md border text-sm font-medium transition-colors ${selectedSize === size ? "border-[#D4AF37] bg-[#D4AF37] text-white" : "border-gray-300 text-gray-700 hover:border-gray-500"}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full bg-[#D4AF37] text-white py-3.5 rounded-md font-bold text-sm uppercase tracking-wider hover:bg-[#C4A12F] transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" /> Add to Cart
        </button>

        {/* Reward Token */}
        <div className=" p-4">
          <div className="flex items-center gap-4">
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">Earn Rapharch Points</h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Get <span className="font-bold text-neutral-900">{rewardPoints} </span>points with this purchase. Learn More
              </p>
            </div>
          </div>
        </div>

        {/* Accordions */}
        {product.description && (
          <Accordion title="Description" defaultOpen>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </Accordion>
        )}

        <Accordion title="Shipping & Returns">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Free Shipping</h4>
                <p className="text-sm text-gray-500 mt-1">Free standard shipping on orders over $100.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Easy Returns</h4>
                <p className="text-sm text-gray-500 mt-1">Free returns within 30 days.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Secure Checkout</h4>
                <p className="text-sm text-gray-500 mt-1">SSL encrypted. Your data is always protected.</p>
              </div>
            </div>
          </div>
        </Accordion>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-6 py-4 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-center gap-6">
          <span className="text-xl font-bold text-gray-900">
            ${displayPrice.toFixed(2)}
            {hasDiscount && product.originalPrice && (
              <span className="text-sm text-gray-400 line-through ml-1.5 font-normal">${product.originalPrice.toFixed(2)}</span>
            )}
          </span>
          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-[#D4AF37] text-white px-8 py-3 rounded-md font-semibold text-sm uppercase tracking-wider hover:bg-[#C4A12F] transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
