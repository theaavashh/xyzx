interface NewArrivalsSkeletonProps {
  count?: number;
}

export function NewArrivalsSkeleton({ count = 5 }: NewArrivalsSkeletonProps) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-full">
        {/* Header skeleton */}
        <div className="flex flex-row md:items-center md:justify-between mb-8 gap-4 px-4 md:px-16">
          <div>
            <div className="h-8 w-40 bg-gray-200 rounded-lg mb-2 animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Products carousel skeleton with shimmer */}
        <div
          className="flex gap-4 pb-6 overflow-x-auto px-4 md:px-16"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {Array.from({ length: count }, (_, i) => (
            <div key={`skeleton-${i}`} className="flex-shrink-0 w-80">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                {/* Image with shimmer */}
                <div className="relative h-96 overflow-hidden bg-gray-100 rounded-t-lg">
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

                {/* Content skeleton */}
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                  <div className="flex gap-1 pt-2 border-t border-gray-100">
                    {Array.from({ length: 4 }, (_, j) => (
                      <div
                        key={j}
                        className="h-4 w-4 bg-gray-200 rounded animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
