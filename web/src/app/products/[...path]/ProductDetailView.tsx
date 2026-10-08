import { Fragment } from "react";
import Link from "next/link";
import ProductShowcase from "@/components/product/ProductShowcase";
import YouMayLike from "@/components/YouMayLike";
import {
  buildCrumbs,
  type ProductDetail,
  type ProductSummary,
} from "./shared";

export default function ProductDetailView({
  product,
  path,
  related,
}: {
  product: ProductDetail;
  path: string[];
  related: ProductSummary[];
}) {
  const crumbs = buildCrumbs(path);

  return (
    <div className="min-h-screen bg-white">
      <main className="px-0 sm:px-6 lg:px-8 pb-24 lg:pb-8">
        <div className="max-w-[2000px] mx-auto">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-zinc-600 flex-wrap px-8 sm:px-4 py-5">
              <li>
                <Link
                  href="/"
                  className="hover:text-zinc-600 transition-colors underline"
                >
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
              {crumbs.map((crumb) => (
                <Fragment key={crumb.href}>
                  <li className="text-zinc-600">/</li>
                  <li>
                    <Link
                      href={crumb.href}
                      className="hover:text-zinc-600 transition-colors underline"
                    >
                      {crumb.label}
                    </Link>
                  </li>
                </Fragment>
              ))}
              <li className="text-zinc-600">/</li>
              <li className="text-zinc-600 font-medium truncate max-w-[200px]">
                {product.name}
              </li>
            </ol>
          </nav>

          <ProductShowcase product={product} />

          <YouMayLike products={related} />
        </div>
      </main>
    </div>
  );
}
