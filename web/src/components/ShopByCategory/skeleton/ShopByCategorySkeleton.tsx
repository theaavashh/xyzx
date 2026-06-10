interface ShopByCategorySkeletonProps {
  count?: number;
}

export function ShopByCategorySkeleton({
  count = 8,
}: ShopByCategorySkeletonProps) {
  const skeletonKeys = Array.from(
    { length: count },
    (_, index) => `skeleton-${index}`,
  );

  return (
    <section className="py-16 bg-[#f9f8f8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skeletonKeys.map((key) => (
            <div
              key={key}
              className="h-80 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
