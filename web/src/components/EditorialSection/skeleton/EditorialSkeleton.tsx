export function EditorialSkeleton() {
  return (
    <section className="py-20 bg-[#F7F6F3]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-2 items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
              <div className="h-14 sm:h-16 lg:h-20 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse max-w-md" />
            </div>
            <div className="h-12 w-40 bg-gray-200 rounded-none animate-pulse" />
          </div>

          <div className="flex gap-4 pb-4 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-72">
                <div className="bg-white rounded-lg">
                  <div className="relative h-80 bg-gray-200 animate-pulse rounded-t-lg" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="flex items-center justify-between">
                      <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
                      <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1 pt-1 border-t border-gray-100">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
