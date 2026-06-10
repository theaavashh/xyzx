"use client";

import { memo, useEffect, useState } from "react";
import { NewArrivalsHeader, ProductCarousel } from "./components";
import { NewArrivalsSkeleton } from "./skeleton";
import { fetchNewArrivals, PRICE_VALID_UNTIL } from "./utils/api";
import type { Product } from "./types";

interface NewArrivalsProps {
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllLabel?: string;
  limit?: number;
}

function NewArrivalsContent({
  title,
  subtitle,
  viewAllLink,
  viewAllLabel,
  limit,
}: NewArrivalsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchNewArrivals();
        if (mounted) {
          setProducts(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load new arrivals",
          );
          setProducts([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return <NewArrivalsSkeleton />;
  }

  if (error || products.length === 0) {
    return <NewArrivalsSkeleton />;
  }

  const displayProducts = limit ? products.slice(0, limit) : products;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "New Arrivals",
    description: "Latest products and new releases at RaphArch",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/new-arrivals`,
    itemListElement: displayProducts.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: `${product.category} - ${product.badge}`,
        image: product.image,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.id}`,
        brand: {
          "@type": "Brand",
          name: "RaphArch",
        },
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.id}`,
          priceValidUntil: PRICE_VALID_UNTIL,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviews,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Safe JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <section
        className="py-12 bg-white"
        aria-labelledby="new-arrivals-heading"
        itemScope
        itemType="https://schema.org/ItemList"
      >
        <meta itemProp="name" content="New Arrivals" />
        <meta
          itemProp="description"
          content="Discover the latest drops and exclusive releases"
        />

        <div className="max-w-full">
          <NewArrivalsHeader
            title={title}
            subtitle={subtitle}
            viewAllLink={viewAllLink}
            viewAllLabel={viewAllLabel}
          />

          <ProductCarousel products={displayProducts} />

          <div className="md:hidden text-center mt-4">
            <p className="text-sm text-gray-500">Swipe to see more →</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default memo(function NewArrivals(props: NewArrivalsProps) {
  return <NewArrivalsContent {...props} />;
});
