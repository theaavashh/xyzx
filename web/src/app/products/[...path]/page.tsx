import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateSEOMetadata } from "@/components/SEO";
import { resolveProductsRoute, type ProductsRoute } from "./data";
import {
  listingTitle,
  plainText,
  resolveImageUrl,
} from "./shared";
import ProductListingView from "./ProductListingView";
import ProductDetailView from "./ProductDetailView";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rapharch.com";

interface ProductsPageProps {
  params: Promise<{ path: string[] }>;
}

function routeMetadata(route: ProductsRoute, path: string[]): Metadata {
  const url = `${SITE_URL}/products/${path.join("/")}`;

  if (route.kind === "product") {
    const { product } = route;
    return generateSEOMetadata({
      title: product.name,
      description:
        plainText(product.shortDescription || product.description) || undefined,
      image:
        resolveImageUrl(product.images?.[0] || product.thumbnail) || undefined,
      url,
    });
  }

  const title = listingTitle(route.genderSlug, route.categorySlug);
  return generateSEOMetadata({
    title,
    description: `Browse ${title} at RaphArch — premium fashion, footwear and accessories with fast shipping and easy returns.`,
    url,
  });
}

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { path } = await params;
  const route = await resolveProductsRoute(path);
  if (!route) return {};
  return routeMetadata(route, path);
}

/**
 * Catch-all for anything under `/products`, so a product can live at any depth:
 *   /products/<gender>/<category>/<product-slug>
 *   /products/<category>/<product-slug>
 *   /products/<gender>/<category>
 *   /products/<gender>
 *
 * The path is resolved and fetched on the server; paths that match neither a
 * product nor a category slug 404.
 */
export default async function ProductsCatchAllPage({
  params,
}: ProductsPageProps) {
  const { path } = await params;
  const route = await resolveProductsRoute(path);

  if (!route) notFound();

  if (route.kind === "product") {
    return (
      <ProductDetailView
        product={route.product}
        path={path}
        related={route.related}
      />
    );
  }

  return (
    <ProductListingView
      key={path.join("/")}
      path={path}
      initialProducts={route.products}
    />
  );
}
