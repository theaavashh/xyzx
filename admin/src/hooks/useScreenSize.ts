import { useCallback, useEffect, useState } from 'react';
import { BREAKPOINTS } from '@/constants/navigation';

export const useScreenSize = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const checkScreenSize = useCallback(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    setIsDesktop(width >= BREAKPOINTS.DESKTOP);
    setIsMobile(width < BREAKPOINTS.MOBILE);
  }, []);

  useEffect(() => {
    checkScreenSize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkScreenSize);
      return () => window.removeEventListener('resize', checkScreenSize);
    }
  }, [checkScreenSize]);

  return { isDesktop, isMobile, checkScreenSize };
};
