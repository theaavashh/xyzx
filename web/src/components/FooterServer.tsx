'use client';

import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import { FooterSkeleton } from '@/components/Footer/skeleton';
import { fetchFooterSections } from '@/components/Footer/utils/api';
import type { FooterSectionData } from '@/components/Footer/types';

export default function FooterServer() {
  const [sections, setSections] = useState<FooterSectionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSections() {
      try {
        const data = await fetchFooterSections();
        if (mounted) {
          setSections(data);
        }
      } catch {
        if (mounted) {
          setSections([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadSections();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return <FooterSkeleton />;
  }

  return <Footer sections={sections} />;
}
