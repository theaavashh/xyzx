import { memo } from 'react';
import { ServiceCard } from './ServiceCard';
import type { ServiceItem } from '../types';

interface ServiceGridProps {
  items: ServiceItem[];
}

export const ServiceGrid = memo(function ServiceGrid({ items }: ServiceGridProps) {
  if (!items.length) return null;

  return (
    <div className="hidden md:grid md:grid-cols-3 gap-6 mb-6">
      {items.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
});
