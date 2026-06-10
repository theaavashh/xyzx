'use client';

import { useEffect, useState } from 'react';
import { ServiceGrid, MobileSlider } from './components';
import { FeatureSkeleton } from './skeleton';
import { fetchFeature } from './utils/api';
import { DEFAULT_SERVICE_ITEMS } from './constants';
import type { FeatureData, ServiceItem } from './types';

function getActiveItems(items?: ServiceItem[]): ServiceItem[] {
  const active = items?.filter((item) => item.isActive) ?? [];
  return active.length > 0 ? active : DEFAULT_SERVICE_ITEMS;
}

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

  const serviceItems = getActiveItems(data?.serviceItems);

  return (
    <section className="bg-white py-8 md:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ServiceGrid items={serviceItems} />
        <MobileSlider items={serviceItems} />
      </div>
    </section>
  );
}
