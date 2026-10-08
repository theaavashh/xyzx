import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { effectivePrice } from "@/lib/price";

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
  variants?: { price?: number }[] | null;
  category?: { id: string; name: string; slug: string } | null;
}

interface YouMayLikeProps {
  products: RelatedProduct[];
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
  const price = effectivePrice(product);

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
            ${price.toFixed(2)}
          </span>
          {product.originalPrice &&
            product.originalPrice > price && (
              <span className="text-xs text-zinc-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
        </div>
      </div>
    </Link>
  );
}

export default function YouMayLike({ products }: YouMayLikeProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-gray-100 py-12 mt-12">
      <div className="mx-auto w-full max-w-[2000px] px-4 sm:px-6 lg:px-8">
        <h2 className="swansea text-2xl md:text-3xl text-zinc-600 mb-8">
          You May Like
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
