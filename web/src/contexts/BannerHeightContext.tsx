'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface BannerHeightContextValue {
  bannerHeight: number;
  setBannerHeight: (height: number) => void;
}

const BannerHeightContext = createContext<BannerHeightContextValue>({
  bannerHeight: 0,
  setBannerHeight: () => {},
});

export function BannerHeightProvider({ children }: { children: ReactNode }) {
  const [bannerHeight, setBannerHeight] = useState(0);

  const handleSetBannerHeight = useCallback((height: number) => {
    setBannerHeight(height);
  }, []);

  return (
    <BannerHeightContext.Provider value={{ bannerHeight, setBannerHeight: handleSetBannerHeight }}>
      {children}
    </BannerHeightContext.Provider>
  );
}

export function useBannerHeight() {
  return useContext(BannerHeightContext);
}
