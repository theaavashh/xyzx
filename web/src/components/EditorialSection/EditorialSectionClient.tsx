"use client";

import Link from 'next/link';
import { EditorialProductCard } from './components';
import type { Product } from './types';

interface EditorialSectionClientProps {
  season: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  products: Product[];
}

export function EditorialSectionClient({
  season,
  title,
  description,
  ctaText,
  ctaLink,
  products,
}: EditorialSectionClientProps) {
  return (
    <section className="py-10 md:py-16 bg-[#F7F6F3]">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center lg:text-left lg:flex lg:justify-between lg:items-start mb-10 lg:mb-14">
          <div className="max-w-2xl mx-auto lg:mx-0">
            <p className="text-sm font-semibold tracking-[0.3em] text-[#D4AF37] uppercase mb-3">
              {season}
            </p>
            <h2 className="bound-regular text-2xl sm:text-3xl lg:text-4xl text-zinc-900 leading-tight mb-4">
              {title}
            </h2>
          </div>
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-right mt-4 lg:mt-0">
            {description && (
              <p className="text-base sm:text-lg text-zinc-500 leading-relaxed">
                {description}
              </p>
            )}
            {ctaText && ctaLink && (
              <div className="mt-4">
                <Link
                  href={ctaLink}
                  className="bg-transparent text-[#D4AF37] underline text-sm font-bold tracking-wider uppercase transition-opacity duration-300 hover:opacity-70 inline-block"
                >
                  {ctaText}
                </Link>
              </div>
            )}
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <EditorialProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-zinc-400 text-lg">No Product Available</p>
          </div>
        )}
      </div>
    </section>
  );
}
