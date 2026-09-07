import { memo, useEffect, useState } from 'react';
import Image from 'next/image';
import type { ServiceItem } from '../types';

interface MobileSliderProps {
  items: ServiceItem[];
}

export const MobileSlider = memo(function MobileSlider({ items }: MobileSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [items.length]);

  if (!items.length) return null;

  return (
    <div className="md:hidden overflow-hidden mb-6 px-4">
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((service) => (
              <article
                key={service.id}
                className="flex-shrink-0 w-full flex items-center justify-center"
              >
                <div className="flex items-center text-center group">
                  <div className="p-3">
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
                    <h3 className="text-lg font-semibold text-zinc-600 whitespace-nowrap">
                      {service.title}
                    </h3>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? 'bg-gray-900 w-4'
                : 'bg-gray-300 w-2 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
});
