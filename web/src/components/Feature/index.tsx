'use client';

import { Truck, RotateCcw, BadgeCheck } from 'lucide-react';

const FEATURES = [
  {
    icon: Truck,
    title: 'Free shipping over $50',
    description: 'Orders above $50 ship free — no hidden fees, no surprises at checkout.',
  },
  {
    icon: RotateCcw,
    title: '30-day easy returns',
    description: 'Changed your mind? Return products within 30 days, hassle-free.',
  },
  {
    icon: BadgeCheck,
    title: 'Trusted by thousands',
    description: 'Join thousands of happy customers who shop with us every month.',
  },
];

export default function Feature() {
  return (
    <section className="w-full border-t border-b border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 px-6 py-8 sm:grid-cols-3 sm:py-10 lg:px-10">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center px-4 py-6 sm:py-0"
            >
              <div className="mb-5 flex h-8 w-8 items-center justify-center">
                <Icon
                  className="h-7 w-7 text-zinc-900"
                  strokeWidth={1.4}
                />
              </div>

              <h3 className="bound-regular text-[18px] leading-tight text-zinc-900">
                {feature.title}
              </h3>

              <p className="mt-3 max-w-[330px] text-xs leading-[1.45] text-zinc-700">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
