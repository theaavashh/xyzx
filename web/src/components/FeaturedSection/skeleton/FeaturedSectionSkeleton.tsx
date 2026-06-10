interface FeaturedSectionSkeletonProps {
  count?: number;
}

export function FeaturedSectionSkeleton({ count = 3 }: FeaturedSectionSkeletonProps) {
  const skeletonKeys = Array.from(
    { length: count },
    (_, index) => `featured-skeleton-${index}`,
  );

  return (
    <section className="py-12 bg-white">
      <div className="max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {skeletonKeys.map((key) => (
            <div key={key} className="relative aspect-square overflow-hidden bg-gray-100">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s infinite linear",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
