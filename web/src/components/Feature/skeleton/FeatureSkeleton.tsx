export function FeatureSkeleton() {
  return (
    <section className="bg-[#F7F6F3] py-8">
      <div className="container mx-auto px-4 py-6 pb-2">
        <div className="hidden md:grid md:grid-cols-3 gap-8 mb-8 md:mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center text-center">
              <div className="p-3">
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="text-left ml-2 space-y-2">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <div className="md:hidden mb-8 px-4">
          <div className="flex items-center justify-center">
            <div className="p-3">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="text-left ml-2 space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full bg-gray-300 ${i === 0 ? 'w-4 bg-gray-900' : 'w-2'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
