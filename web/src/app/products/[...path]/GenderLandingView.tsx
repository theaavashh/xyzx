import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { capitalize, resolveImageUrl, type CategoryNode } from "./shared";

const GENDER_LABELS: Record<string, string> = {
  women: "Women",
  men: "Men",
  kids: "Kids",
  unisex: "Unisex",
};

export default function GenderLandingView({
  gender,
  categories,
}: {
  gender: string;
  categories: CategoryNode[];
}) {
  const genderLabel = GENDER_LABELS[gender.toLowerCase()] || capitalize(gender);

  return (
    <main className="min-h-screen bg-white">
      <header className="bg-[#f6f6f6] px-5 py-5 sm:px-8 sm:py-6 lg:px-8">
        <nav className="flex items-center gap-3 text-[11px] text-zinc-500 mb-5">
          <Link href="/" className="hover:text-zinc-900">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-zinc-900">
            Collections
          </Link>
          <span>/</span>
          <span className="text-zinc-700 capitalize">{genderLabel}</span>
        </nav>
        <h1 className="bound-regular text-[30px] leading-none tracking-[-0.03em] sm:text-[34px]">
          {genderLabel}
        </h1>
      </header>

      <div className="max-w-[2000px] mx-auto px-5 py-10 sm:px-8 lg:px-8">
        {categories.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-sm text-zinc-400 mb-4">No categories found</p>
            <Link
              href="/products/all"
              className="text-[12px] font-medium text-zinc-900 underline"
            >
              View all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products/${gender}/${category.slug}`}
                className="group block"
              >
                <div className="relative aspect-[0.86] overflow-hidden bg-zinc-100 mb-3">
                  {category.image ? (
                    <img
                      src={resolveImageUrl(category.image)}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-zinc-300 text-xs">
                      {category.name}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-zinc-900 group-hover:text-[#D4AF37] transition-colors">
                    {category.name}
                  </h3>
                  <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-[#D4AF37] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
