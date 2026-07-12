'use client';

import { useEffect, useState } from 'react';
import { ServiceGrid, MobileSlider } from './components';
import { FeatureSkeleton } from './skeleton';
import { fetchFeature } from './utils/api';
import type { FeatureData } from './types';

export default function Feature() {
  const [data, setData] = useState<FeatureData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const result = await fetchFeature();
        if (mounted) {
          setData(result);
        }
      } catch {
        if (mounted) {
          setData(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return <FeatureSkeleton />;
  }

  const serviceItems = data?.serviceItems?.filter((item) => item.isActive) ?? [];

  if (serviceItems.length === 0) return null;

  return (
    <section className="bg-white py-8 md:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ServiceGrid items={serviceItems} />
        <MobileSlider items={serviceItems} />
      </div>
    </section>
  );
}
