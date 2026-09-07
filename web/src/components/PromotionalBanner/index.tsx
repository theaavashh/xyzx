'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';

interface BannerData {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  textColor: string;
  link: string | null;
  isActive: boolean;
  order: number;
}

export default function PromotionalBanner() {
  const { data } = useQuery<BannerData[]>({
    queryKey: ['promotional-banners-active'],
    queryFn: async () => {
      const res = await fetch('/api/v1/public/promotional-banners/active');
      if (!res.ok) throw new Error('Failed');
      const json = await res.json();
      return Array.isArray(json) ? json : json.data ?? [];
    },
    staleTime: 60_000,
  });

  const banner = data?.[0];
  if (!banner) return null;

  const content = (
    <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
      <Image
        src={banner.image}
        alt={banner.title}
        fill
        className="object-cover"
        sizes="100vw"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 h-full flex flex-col items-center justify-center text-center lg:px-10">
        <h2
          className="bound-regular text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide leading-tight"
          style={{ color: banner.textColor }}
        >
          {banner.title}
        </h2>
        {banner.subtitle && (
          <p
            className="mt-4 text-2xl md:text-3xl lg:text-4xl font-medium max-w-xl mx-auto opacity-80"
            style={{ color: banner.textColor }}
          >
            {banner.subtitle}
          </p>
        )}
      </div>
    </section>
  );

  if (banner.link) {
    return <Link href={banner.link}>{content}</Link>;
  }

  return content;
}
