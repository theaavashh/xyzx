"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9999";

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  discountPercent: number | null;
  thumbnail: string | null;
  images: string[] | null;
  category: { id: string; name: string; slug: string } | null;
}

interface YouMayLikeProps {
  categoryId: string | null;
  excludeId: string;
}

function resolveImage(url: string): string {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return `${API_BASE_URL}${url}`;
}

function ProductCard({ product }: { product: RelatedProduct }) {
  const href = product.category?.slug
    ? `/products/${product.category.slug}/${product.slug}`
    : `/products/all/${product.slug}`;
  const image = product.thumbnail || product.images?.[0] || "";

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
        {image ? (
          <Image
            src={resolveImage(image)}
            alt={product.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            <ShoppingBag className="w-12 h-12" />
          </div>
        )}

        {product.discountPercent ? (
          <span className="absolute top-3 left-3 bg-black text-white text-xs font-medium px-2.5 py-1 tracking-wide">
            -{product.discountPercent}%
          </span>
        ) : null}

        <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center bg-white shadow-sm opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <ShoppingBag className="h-4 w-4 text-zinc-900" strokeWidth={1.5} />
        </div>
      </div>

      <div className="mt-3">
        <h4 className="line-clamp-2 text-sm font-medium leading-5 text-zinc-800">
          {product.name}
        </h4>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-900">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice &&
            product.originalPrice > product.price && (
              <span className="text-xs text-zinc-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
        </div>
      </div>
    </Link>
  );
}

export default function YouMayLike({
  categoryId,
  excludeId,
}: YouMayLikeProps) {
  const [products, setProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const params = new URLSearchParams({
          isActive: "true",
          limit: "8",
        });
        if (categoryId) {
          params.set("categoryId", categoryId);
        }
        const res = await fetch(
          `${API_BASE_URL}/api/v1/products?${params}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        if (!res.ok) return;
        const json = await res.json();
        if (!json.success || !Array.isArray(json.data)) return;
        const related = json.data
          .filter((p: RelatedProduct) => p.id !== excludeId)
          .slice(0, 4);
        setProducts(related);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [categoryId, excludeId]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="border-t border-gray-100 py-12 mt-12">
      <div className="mx-auto w-full max-w-[2000px] px-4 sm:px-6 lg:px-8">
        <h2 className="swansea text-2xl md:text-3xl text-zinc-600 mb-8">
          You May Like
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
