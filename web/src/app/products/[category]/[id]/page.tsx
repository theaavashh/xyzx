"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ChevronRight, ShoppingBag } from "lucide-react";
import ProductShowcase from "./ProductShowcase";

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
  params: Promise<{ category: string; id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/v1/products/${id}`);
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
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
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
      <main className="px-4 sm:px-6 lg:px-8 py-8  pb-24 lg:pb-8">
        <div className="max-w-[2000px] mx-auto">
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-gray-900 transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-4 h-4" />
              <li>
                <Link
                  href="/products"
                  className="hover:text-gray-900 transition-colors"
                >
                  Products
                </Link>
              </li>
              {product.category && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <li>
                    <Link
                      href={`/products/${product.category.slug}`}
                      className="hover:text-gray-900 transition-colors capitalize"
                    >
                      {product.category.name}
                    </Link>
                  </li>
                </>
              )}
              <ChevronRight className="w-4 h-4" />
              <li className="text-gray-900 font-medium truncate max-w-[200px]">
                {product.name}
              </li>
            </ol>
          </nav>

          <ProductShowcase product={product} />
        </div>
      </main>
    </div>
  );
}
