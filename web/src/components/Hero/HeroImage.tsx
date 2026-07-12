'use client';

import { memo } from 'react';
import Image from 'next/image';

interface HeroImageProps {
  src: string;
  srcMobile?: string;
  alt: string;
  priority?: boolean;
}

function HeroImageComponent({ src, srcMobile, alt, priority }: HeroImageProps) {
  return (
    <>
      {srcMobile ? (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            className="hidden md:block object-cover"
            priority={priority}
            sizes="100vw"
            quality={85}
          />
          <Image
            src={srcMobile}
            alt={alt}
            fill
            className="md:hidden object-cover"
            priority={priority}
            sizes="100vw"
            quality={80}
          />
        </>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={priority}
          sizes="100vw"
          quality={85}
        />
      )}
    </>
  );
}

export const HeroImage = memo(HeroImageComponent);
