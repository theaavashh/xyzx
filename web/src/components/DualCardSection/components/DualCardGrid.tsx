'use client';

import { memo } from 'react';
import type { DualCard } from '../types';
import { DualCardItem } from './DualCardItem';

interface DualCardGridProps {
  cards: DualCard[];
}

export const DualCardGrid = memo(function DualCardGrid({ cards }: DualCardGridProps) {
  if (cards.length < 2) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
      {cards.map((card, index) => (
        <DualCardItem key={card.id} card={card} index={index} />
      ))}
    </div>
  );
});
