"use client";

import { memo } from "react";
import type { GalleryItem as GalleryItemType } from "../types";
import { GalleryItem } from "./GalleryItem";

interface GalleryGridProps {
  items: GalleryItemType[];
}

export const GalleryGrid = memo(function GalleryGrid({
  items,
}: GalleryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
      {items.map((item, index) => (
        <GalleryItem
          key={item.id}
          item={item}
          index={index}
          priority={index < 3}
        />
      ))}
    </div>
  );
});
