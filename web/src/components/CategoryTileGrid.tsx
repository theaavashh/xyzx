"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9999";

export interface CategoryTile {
  title: string;
  image: string;
  link: string;
  subtitle?: string;
}

interface TileItem {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string;
  order: number;
}

interface TileSection {
  id: string;
  isActive: boolean;
  order: number;
  items: TileItem[];
}

function resolveImage(url: string): string {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return `${API_BASE_URL}${url}`;
}

function Tile({ item }: { item: TileItem }) {
  return (
    <Link
      href={item.link}
      className="group relative block aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-neutral-100"
    >
      <div className="absolute -inset-2 overflow-hidden">
        <Image
          src={resolveImage(item.image)}
          alt={item.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover transition-all duration-700 ease-out scale-100 group-hover:scale-110"
        />
      </div>

      <div className="absolute inset-0 bg-black/25 transition-colors duration-700 group-hover:bg-black/40" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h3 className="bound-regular tracking-wide text-2xl md:text-3xl lg:text-4xl text-white leading-tight font-medium">
          {item.title}
        </h3>
        {item.subtitle && (
          <span className="mt-2 text-sm text-white tracking-wider uppercase">
            {item.subtitle}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function CategoryTileGrid() {
  const [items, setItems] = useState<TileItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/public/category-tile-grid/active`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) return;
        const json = await res.json();
        const sections: TileSection[] = json.data || [];
        const section = sections[0];
        if (section && Array.isArray(section.items)) {
          setItems(section.items);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[3/4] sm:aspect-[4/5] bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {items.map((item) => (
              <Tile key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
