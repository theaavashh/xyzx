export function FooterSkeleton() {
  return (
    <section className="bg-[#F2EBCC] border-t border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200/60 mt-12 pt-8">
          <div className="flex flex-col items-center lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="flex gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 w-10 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
