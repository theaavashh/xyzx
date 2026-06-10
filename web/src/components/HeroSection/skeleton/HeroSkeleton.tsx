export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[95vh] min-h-[800px] overflow-hidden bg-white">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite linear',
        }}
      />
    </div>
  );
}
