import { memo } from 'react';
import Image from 'next/image';
import type { ServiceItem } from '../types';

interface ServiceCardProps {
  service: ServiceItem;
}

export const ServiceCard = memo(function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="flex items-center justify-center text-center group">
      <div className="mb-4 p-3">
        <Image
          src={service.image}
          alt={service.title}
          width={32}
          height={32}
          className="w-8 h-8"
          draggable={false}
        />
      </div>
      <div className="text-left ml-2">
        <h3 className="text-lg md:text-xl font-semibold text-zinc-600">
          {service.title}
        </h3>
      </div>
    </article>
  );
});
