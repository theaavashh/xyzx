"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import ProductShowcase from "./ProductShowcase";
import YouMayLike from "@/components/YouMayLike";

interface Variant {
  color?: string;
  size?: string;
  price?: number;
  sku?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  originalPrice: number | null;
  discountPercent: number | null;
  quantity: number;
  images: string[] | null;
  thumbnail: string | null;
  videos: string[] | null;
  isActive: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  isFeatured: boolean;
  gender: string | null;
  material: string | null;
  season: string | null;
  variantAttributes: string[] | null;
  selectedSizes: string[] | null;
  selectedColors: string[] | null;
  variants: Variant[] | null;
  category: { id: string; name: string; slug: string } | null;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9999";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        // First, try to find product by slug via the list endpoint
        const listRes = await fetch(
          `${API_BASE_URL}/api/v1/products?slug=${encodeURIComponent(slug)}&limit=1&isActive=true`
        );
        const listData = await listRes.json();

        let productId: string | null = null;
        if (
          listData.success &&
          Array.isArray(listData.data) &&
          listData.data.length > 0
        ) {
          productId = listData.data[0].id;
        }

        if (!productId) {
          setError("Product not found");
          setLoading(false);
          return;
        }

        // Fetch full product details by ID
        const res = await fetch(`${API_BASE_URL}/api/v1/products/${productId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setProduct(data.data);
        } else {
          setError("Product not found");
        }
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-zinc-600 mb-2">
            {error || "Product not found"}
          </h1>
          <Link
            href="/products"
            className="inline-block mt-4 text-[#D4AF37] hover:underline font-medium"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="px-0 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        <div className="max-w-[2000px] mx-auto">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-zinc-600 rounded-none sm:rounded-md px-8  sm:px-4 py-5">
              <li>
                <Link href="/" className="hover:text-zinc-600 transition-colors underline">
                  Home
                </Link>
              </li>
              <li className="text-zinc-600">/</li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-zinc-600 transition-colors underline"
                >
                  Products
                </Link>
              </li>
              {product.category && (
                <>
                  <li className="text-zinc-600">/</li>
                  <li>
                    <Link
                      href={`/products/${product.category.slug}`}
                      className="hover:text-zinc-600 transition-colors capitalize underline"
                    >
                      {product.category.name}
                    </Link>
                  </li>
                </>
              )}
              <li className="text-zinc-600">/</li>
              <li className="text-zinc-600 font-medium truncate max-w-[200px]">
                {product.name}
              </li>
            </ol>
          </nav>

          <ProductShowcase product={product} />

          <YouMayLike
            categoryId={product.category?.id ?? null}
            excludeId={product.id}
          />
        </div>
      </main>
    </div>
  );
}
