'use client';

import { SidebarItem } from './SidebarItem';
import type { NavItem } from '@/constants/navigation';

interface SidebarSectionProps {
  title: string;
  items: NavItem[];
  expandedSections: string[];
  toggleSection: (id: string) => void;
  handleNavigation: (itemId: string, parentId?: string) => void;
  animatingItems: Record<string, boolean>;
}

export function SidebarSection({
  title,
  items,
  expandedSections,
  toggleSection,
  handleNavigation,
  animatingItems,
}: SidebarSectionProps) {
  return (
    <div className="mt-3 first:mt-0">
      <h2 className="text-base font-semibold text-gray-500 uppercase tracking-normal px-3 mb-1.5 lastik">
        {title}
      </h2>
      <div className="space-y-0.5">
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            handleNavigation={handleNavigation}
            animatingItems={animatingItems}
          />
        ))}
      </div>
    </div>
  );
}
