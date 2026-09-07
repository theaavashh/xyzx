export function VisitOurStoreSkeleton() {
  return (
    <section className="relative py-24 lg:py-28 bg-[#F7F6F3] overflow-hidden">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <div className="h-8 w-48 bg-gray-100 rounded-full animate-pulse mx-auto" />
          <div className="h-12 w-72 bg-gray-100 rounded-xl animate-pulse mx-auto" />
          <div className="h-5 w-full max-w-2xl bg-gray-100 rounded-lg animate-pulse mx-auto" />
        </div>

        <div className="aspect-[16/9] w-full bg-gray-100 rounded-3xl animate-pulse" />

        <div className="h-4 w-64 bg-gray-100 rounded-lg animate-pulse mx-auto mt-6" />
      </div>
    </section>
  );
}
