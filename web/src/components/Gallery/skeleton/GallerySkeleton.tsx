interface GallerySkeletonProps {
  count?: number;
}

export function GallerySkeleton({ count = 3 }: GallerySkeletonProps) {
  const skeletonKeys = Array.from(
    { length: count },
    (_, index) => `gallery-skeleton-${index}`,
  );

  return (
    <section className="py-12 bg-white">
      <div className="max-w-full">
        {/* Grid skeleton with shimmer */}
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
