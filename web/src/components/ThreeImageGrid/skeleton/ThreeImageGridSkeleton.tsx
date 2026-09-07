export function ThreeImageGridSkeleton() {
  return (
    <section className="py-8 bg-[#F7F6F3]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative aspect-[3/4] bg-gray-200 animate-pulse rounded-sm">
              {i === 0 && (
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 w-48 h-20 bg-white/80 rounded-sm animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
