"use client";

import { memo, useEffect, useState } from "react";
import { BannerImage } from "./components/BannerImage";
import { BannerSkeleton } from "./skeleton";
import { HEIGHT_CLASSES, fetchBanner } from "./utils";
import type { Banner } from "./types";

interface BannerProps {
  height?: "sm" | "md" | "lg" | "xl" | "full";
  priority?: boolean;
  maxRetries?: number;
}

function BannerContent({
  height = "xl",
  priority = false,
  maxRetries = 3,
}: BannerProps) {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const heightClass = HEIGHT_CLASSES[height];

  useEffect(() => {
    let mounted = true;

    async function loadBanner() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchBanner();
        if (mounted) {
          setBanner(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load banner",
          );
          setBanner(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadBanner();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return <BannerSkeleton height={height} />;
  }

  if (error || !banner) {
    return <BannerSkeleton height={height} />;
  }

  return (
    <div className="w-full">
      <div className={`relative w-full ${heightClass} overflow-hidden`}>
        <BannerImage
          src={banner.image}
          alt={banner.alt || "Banner"}
          priority={priority}
          maxRetries={maxRetries}
        />
      </div>
    </div>
  );
}

export default memo(function Banner(props: BannerProps) {
  return <BannerContent {...props} />;
});
