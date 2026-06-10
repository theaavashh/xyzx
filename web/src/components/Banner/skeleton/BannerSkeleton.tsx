import { HEIGHT_CLASSES } from "../utils";

interface BannerSkeletonProps {
  height?: "sm" | "md" | "lg" | "xl" | "full";
}

export function BannerSkeleton({ height = "xl" }: BannerSkeletonProps) {
  const heightClass = HEIGHT_CLASSES[height];

  return (
    <div className="w-full">
      <div
        className={`relative w-full ${heightClass} overflow-hidden bg-gray-100`}
      >
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
    </div>
  );
}
