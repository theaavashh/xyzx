export function DualCardSkeleton() {
  return (
    <section className="py-8 bg-[#F7F6F3]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {[0, 1].map((i) => (
            <div key={i}>
              <div className="relative overflow-hidden aspect-[4/5] sm:aspect-[3/4] bg-gray-200 animate-pulse rounded-md" />
              <div className="mt-4 text-left space-y-3">
                <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
