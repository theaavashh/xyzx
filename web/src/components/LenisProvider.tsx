'use client';

import { ReactLenis } from 'lenis/react';
import { useRef } from 'react';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
      }}
    >
      {children}
    </ReactLenis>
  );
}
