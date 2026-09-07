"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Truck, Shield, Package, ChevronDown, Ruler, X, Gift, Loader2, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContextTanStack";

interface Variant {
  color?: string;
  size?: string;
  pattern?: string;
  price?: number;
  comparePrice?: number;
  discountPrice?: number;
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
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return `${API_BASE_URL}${url}`;
}

function Accordion({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-gray-100">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left"
      >
        <span className="text-sm font-medium tracking-wide text-zinc-600 uppercase">{title}</span>
        <ChevronDown className={`w-4 h-4 text-zinc-600 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[2000px] pb-6" : "max-h-0"}`}>
        {children}
      </div>
    </div>
  );
}

export default function ProductShowcase({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [userRewardPoints, setUserRewardPoints] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${API_BASE_URL}/api/v1/user-rewards/balance`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setUserRewardPoints(data.data.balance || 0);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const variantAttrs = (product.variantAttributes || []) as unknown as Array<{
    id: string; name: string; type: string;
    options: Array<{ id: string; name: string; value: string; color?: string; image?: string; patternImage?: string }>;
  }>;
  const colorAttr = variantAttrs.find(a => a.id === "color" || a.type === "color");
  const sizeAttr = variantAttrs.find(a => a.id === "size" || a.type === "size");
  const patternAttr = variantAttrs.find(a => a.id === "pattern" || a.type === "pattern");
  const extractedColors = colorAttr?.options?.map(o => o.name) || [];
  const extractedSizes = sizeAttr?.options?.map(o => o.name) || [];
  const patternOptions = (patternAttr?.options || [])
    .map(o => ({ name: o.name, image: o.patternImage }))
    .filter(o => o.name);
  const colorOptions = (colorAttr?.options || [])
    .map(o => ({ name: o.name, image: o.image }))
    .filter(o => o.name);
  const colorHexMap = new Map((colorAttr?.options || []).map(o => [o.name, o.color && o.color.startsWith('#') ? o.color : (COLOR_MAP[o.name] || getColorHex(o.name) || o.color || '')]));
  const colorByIdMap = new Map((colorAttr?.options || []).map(o => [o.id, o.name]));
  const sizeByIdMap = new Map((sizeAttr?.options || []).map(o => [o.id, o.name]));
  const patternByIdMap = new Map((patternAttr?.options || []).map(o => [o.id, o.name]));

  const displayColors = product.selectedColors && product.selectedColors.length > 0 ? product.selectedColors : extractedColors;
  const displaySizes = product.selectedSizes && product.selectedSizes.length > 0 ? product.selectedSizes : extractedSizes;

  const [selectedColor, setSelectedColor] = useState<string>(displayColors[0] || "");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedPattern, setSelectedPattern] = useState<string>("");
  const [cartState, setCartState] = useState<"idle" | "loading" | "success">("idle");
  const [currentImage, setCurrentImage] = useState(0);
  const [manualProductView, setManualProductView] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowRewardModal(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddToCart = async () => {
    if (cartState === "loading") return;
    setCartState("loading");
    try {
      await addToCart(
        product.id,
        1,
        selectedSize || undefined,
        selectedColor || undefined
      );
      setCartState("success");
      setTimeout(() => setCartState("idle"), 2000);
    } catch {
      setCartState("idle");
    }
  };

  const allImages: string[] = [];
  if (product.images && product.images.length > 0) {
    allImages.push(...product.images);
  } else if (product.thumbnail) {
    allImages.push(product.thumbnail);
  }

  const getVariantImage = (): string | null => {
    if (selectedPattern) {
      const opt = patternOptions.find((o) => o.name === selectedPattern);
      if (opt?.image) return opt.image;
    }
    if (selectedColor) {
      const opt = (colorAttr?.options || []).find((o) => o.name === selectedColor) as
        | { image?: string }
        | undefined;
      if (opt?.image) return opt.image;
    }
    return null;
  };

  const activeVariantImage = !manualProductView ? getVariantImage() : null;
  const mainImage = activeVariantImage || allImages[currentImage] || allImages[0] || "";

  const hasColorVariants = displayColors.length > 0;
  const hasSizeVariants = displaySizes.length > 0;
  const hasPatternVariants = patternOptions.length > 0;

  const filteredSizes = hasSizeVariants && selectedColor
    ? [...new Set((product.variants || []).filter(v => {
        const vColor = (v.color || '').toLowerCase();
        return vColor === selectedColor.toLowerCase();
      }).map(v => sizeByIdMap.get(v.size || '') || v.size || ''))]
    : displaySizes;

  const selectedVariant = selectedColor && selectedSize
    ? (product.variants || []).find(v => {
        const vColor = colorByIdMap.get(v.color || '') || v.color || '';
        const vSize = sizeByIdMap.get(v.size || '') || v.size || '';
        const vPattern = patternByIdMap.get(v.pattern || '') || v.pattern || '';
        return vColor.toLowerCase() === selectedColor.toLowerCase() && vSize.toLowerCase() === selectedSize.toLowerCase() && (!selectedPattern || vPattern.toLowerCase() === selectedPattern.toLowerCase());
      })
    : null;

  // Stock check: if a specific variant is selected, check its quantity;
  // otherwise sum all variants (or fall back to product.quantity)
  const selectedVariantQuantity = selectedVariant?.quantity ?? 0;
  const totalQuantity = (product.variants && product.variants.length > 0)
    ? product.variants.reduce((sum, v) => sum + (v.quantity || 0), 0)
    : product.quantity;
  const inStock = selectedVariant ? selectedVariantQuantity > 0 : totalQuantity > 0;

  const FREE_SHIPPING_THRESHOLD = 2000;
  const pointsNeeded = Math.max(FREE_SHIPPING_THRESHOLD - userRewardPoints, 0);
  const pointsProgress = Math.min((userRewardPoints / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
  const displayPrice = selectedVariant?.price ?? firstVariant?.price ?? product.price;
  const variantOriginal =
    selectedVariant?.discountPrice ?? selectedVariant?.comparePrice ?? null;
  const hasVariantDiscount =
    typeof variantOriginal === "number" && variantOriginal > displayPrice;
  const hasProductDiscount = !!product.discountPercent && product.discountPercent > 0;
  const hasDiscount = hasVariantDiscount || hasProductDiscount;
  const originalPriceShown = hasVariantDiscount
    ? variantOriginal
    : hasProductDiscount
      ? product.originalPrice
      : null;
  const rewardPoints = Math.floor(displayPrice * 10);
  const avgRating = product.rating ?? 0;
  const reviewCount = product.reviewsCount ?? 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16">
      {/* Image Gallery — 3/5 width */}
      <div className="lg:col-span-3">
        <div className="relative aspect-[4/5] bg-[#f5f5f5] overflow-hidden">
          {mainImage ? (
            <img
              src={resolveImage(mainImage)}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600">
              <ShoppingCart className="w-20 h-20" />
            </div>
          )}
          {(product.isOnSale && product.discountPercent) || hasVariantDiscount ? (
            <span className="absolute top-5 left-5 bg-black text-white text-xs font-medium px-3 py-1.5 tracking-wide">
              -{hasVariantDiscount
                ? Math.round((1 - displayPrice / (variantOriginal as number)) * 100)
                : product.discountPercent}%
            </span>
          ) : null}
        </div>
        {allImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {allImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setCurrentImage(i); setManualProductView(true); }}
                className={`flex-shrink-0 w-[72px] h-[96px] overflow-hidden transition-opacity ${
                  i === currentImage ? "opacity-100 border-gray-900" : "opacity-70 hover:opacity-100 border-transparent"
                }`}
              >
                <img
                  src={resolveImage(img)}
                  alt={`${product.name} ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details — 2/5 width */}
      <div className="lg:col-span-2 flex flex-col bg-white">
        <div className="sticky top-28 px-4 ">
          {/* Title & Rating */}
          <div className="mb-8">
            <h1 className="bound-regular text-2xl md:text-3xl text-zinc-600 leading-tight">
              {product.name}
            </h1>
            {product.material && (
              <p className="text-sm text-zinc-600 mt-2 capitalize">{product.material}</p>
            )}
          </div>

          {/* Price */}
          <div className="mb-8">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-zinc-600">
                ${displayPrice}
              </span>
              {hasDiscount && originalPriceShown ? (
                <>
                  <span className="text-base text-zinc-600 line-through">
                    ${originalPriceShown.toFixed(2)}
                  </span>
                  <span className="text-xs text-red-500 font-medium uppercase tracking-wide">
                    Save ${(originalPriceShown - displayPrice).toFixed(2)}
                  </span>
                </>
              ) : null}
            </div>
            <p className="text-sm text-zinc-600 mt-1">Tax Included</p>
          </div>

          {/* Color & Pattern Variants */}
          {hasColorVariants && displayColors.length > 0 && (
            <>
              <hr className="border-gray-200 my-6" />
              <div>
                <h3 className="text-xs font-medium text-zinc-600 mb-3 tracking-wide">
                  Color: <span className="font-normal text-zinc-600 normal-case">{selectedColor}{selectedPattern ? ` - ${selectedPattern}` : ""}</span>
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  {colorOptions.map((opt) => (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => { setSelectedColor(opt.name); setSelectedSize(""); setManualProductView(false); }}
                      title={opt.name}
                      aria-label={opt.name}
                      className={`w-9 h-9 border overflow-hidden transition-all ${
                        selectedColor === opt.name
                          ? "border-gray-900 ring-2 ring-gray-900/10"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      style={opt.image ? undefined : { backgroundColor: colorHexMap.get(opt.name) || getColorHex(opt.name) }}
                    >
                      {opt.image ? (
                        <img
                          src={resolveImage(opt.image)}
                          alt={opt.name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </button>
                  ))}

                  {hasPatternVariants && patternOptions.map((opt) => (
                    <button
                      key={opt.name}
                      type="button"
                        onClick={() => { setSelectedPattern(selectedPattern === opt.name ? "" : opt.name); setManualProductView(false); }}
                      title={opt.name}
                      aria-label={opt.name}
                      className={`w-12 h-12 border overflow-hidden transition-all ${
                        selectedPattern === opt.name
                          ? "border-gray-900 ring-2 ring-gray-900/10"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {opt.image ? (
                        <img
                          src={opt.image}
                          alt={opt.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="flex items-center justify-center w-full h-full text-xs font-medium uppercase">
                          {opt.name}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <hr className="border-gray-100 my-6" />
            </>
          )}

          {/* Size Variants */}
          {hasSizeVariants && filteredSizes.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-zinc-600 uppercase tracking-widest">
                  Size — <span className="font-normal text-zinc-600 normal-case">{selectedSize || "Select"}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs text-zinc-600 hover:text-zinc-600 underline underline-offset-4 transition-colors"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size || "")}
                    className={`min-w-[48px] px-5 py-2.5 border text-xs font-medium uppercase tracking-wider transition-colors ${
                      selectedSize === size
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 text-zinc-600 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowRewardModal(true)}
            className="mt-2 w-full p-3 bg-gray-50 text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <Gift className="w-4 h-4 text-zinc-600" />
              </div>
              <div>
                <p className="text-xs font-normal text-zinc-600 tracking-wide">
                  Earn <span>{rewardPoints} Rapharch Points</span> with this purchase.<br />Tap to learn more
                </p>
              </div>
            </div>
          </button>

          {/* Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock || cartState === "loading"}
            className="w-full mt-5 bg-gray-900 text-white py-4 text-xs font-medium uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {!inStock ? (
              'Out of Stock'
            ) : cartState === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : cartState === "success" ? (
              <>
                <Check className="w-4 h-4" />
                Added
              </>
            ) : (
              'Add to Cart'
            )}
          </button>

          {/* Free Shipping Progress */}
          <div className="mt-5 p-4 bg-gray-50">
            {isAuthenticated ? (
              <>
                <p className="text-xs text-zinc-600 mb-2">
                  {pointsNeeded > 0 ? (
                    <>
                      Only <span className="font-semibold">{pointsNeeded.toLocaleString()} points</span> away from free shipping
                    </>
                  ) : (
                    <span className="font-semibold text-green-600">You&apos;ve unlocked free shipping!</span>
                  )}
                </p>
                <div className="w-full bg-gray-200 h-1.5">
                  <div
                    className="bg-green-600 h-1.5 transition-all duration-500"
                    style={{ width: `${pointsProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1.5">
                  {userRewardPoints.toLocaleString()} / {FREE_SHIPPING_THRESHOLD.toLocaleString()} points
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-zinc-600 mb-2">
                  Earn <span className="font-semibold">2,000 points</span> to unlock free shipping
                </p>
                <div className="w-full bg-gray-200 h-1.5">
                  <div className="bg-green-600 h-1.5" style={{ width: "0%" }} />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1.5">
                  Sign in to track your points progress
                </p>
              </>
            )}
          </div>

          {/* Pickup Information */}
          <div className="mt-5 p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <div className="text-sm">
                <p className="text-zinc-600">Pickup available at <span className="font-semibold">Rapharch Store</span></p>
                <p className="text-green-600 font-medium mt-0.5">In stock</p>
                <p className="text-zinc-600 mt-0.5">Usually ready in 24 hours</p>
                <a href="/stores" className="text-zinc-600 underline underline-offset-2 mt-1 inline-block hover:text-zinc-900 transition-colors">View Store</a>
              </div>
            </div>
          </div>

          {/* Reward Points Trigger */}
          

          {/* Accordions */}
          {product.description && (
            <Accordion title="Description" defaultOpen>
              <div className="text-sm text-zinc-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
            </Accordion>
          )}

          <Accordion title="Shipping & Returns">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="w-4 h-4 text-zinc-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-medium text-zinc-600 uppercase tracking-wide">Free Shipping</h4>
                  <p className="text-sm text-zinc-600 mt-1">Free standard shipping on orders over $100.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-4 h-4 text-zinc-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-medium text-zinc-600 uppercase tracking-wide">Easy Returns</h4>
                  <p className="text-sm text-zinc-600 mt-1">Free returns within 30 days.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-zinc-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-medium text-zinc-600 uppercase tracking-wide">Secure Checkout</h4>
                  <p className="text-sm text-zinc-600 mt-1">SSL encrypted. Your data is always protected.</p>
                </div>
              </div>
            </div>
          </Accordion>
        </div>
      </div>

      {/* Reward Points Modal */}
      <AnimatePresence>
        {showRewardModal && (
          <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-none lg:hidden">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-2xl px-6 py-5 shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowRewardModal(false)}
                className="absolute top-3 right-3 text-zinc-600 hover:text-zinc-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-bold text-zinc-600">Earn {rewardPoints} Rapharch Points</h3>
              <p className="text-xs text-zinc-600 mt-1">
                Purchase this product and redeem your points on future orders.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
