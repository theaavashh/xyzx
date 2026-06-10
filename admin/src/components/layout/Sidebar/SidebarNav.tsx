'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { NAVIGATION_SECTIONS, ROUTE_MAP } from '@/constants/navigation';
import type { NavItem } from '@/constants/navigation';
import { SidebarSection } from './SidebarSection';

interface SidebarNavProps {
  expandedSections: string[];
  toggleSection: (id: string) => void;
  handleNavigation: (itemId: string, parentId?: string) => void;
  animatingItems: Record<string, boolean>;
}

function collectItemIds(items: NavItem[]): string[] {
  const ids: string[] = [];
  for (const item of items) {
    ids.push(item.id);
    if (item.children) {
      ids.push(...collectItemIds(item.children));
    }
  }
  return ids;
}

function buildContentRoutes(): Set<string> {
  const contentSection = NAVIGATION_SECTIONS.find((s) => s.id === 'content');
  if (!contentSection) return new Set();
  const itemIds = collectItemIds(contentSection.items);
  const routes = new Set<string>();
  for (const id of itemIds) {
    const route = ROUTE_MAP[id];
    if (route) routes.add(route);
  }
  return routes;
}

function getInitialTab(pathname: string, contentRoutes: Set<string>): 'main' | 'content' {
  if (contentRoutes.has(pathname)) return 'content';
  for (const route of contentRoutes) {
    if (pathname.startsWith(route + '/')) return 'content';
  }
  return 'main';
}

export function SidebarNav({
  expandedSections,
  toggleSection,
  handleNavigation,
  animatingItems,
}: SidebarNavProps) {
  const pathname = usePathname();
  const contentRoutes = useMemo(() => buildContentRoutes(), []);
  const [activeTab, setActiveTab] = useState<'main' | 'content'>(() => getInitialTab(pathname, contentRoutes));

  useEffect(() => {
    setActiveTab(getInitialTab(pathname, contentRoutes));
  }, [pathname, contentRoutes]);

  const filteredSections = NAVIGATION_SECTIONS.filter((section) => {
    return activeTab === 'content' ? section.id === 'content' : section.id !== 'content';
  });

  return (
    <nav suppressHydrationWarning className="flex-1 overflow-y-auto px-1 py-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div className="flex gap-1 px-2 py-1 mb-3 bg-gray-50 rounded-md mx-2">
        <button
          onClick={() => setActiveTab('main')}
          className={`flex-1 py-1.5 text-xl font-medium rounded-md transition-all lastik ${
            activeTab === 'main'
              ? 'bg-[#D4AF37] text-white'
              : 'bg-gray-50 text-gray-500 hover:text-gray-700'
          }`}
        >
          Main
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-1.5 text-xl font-medium rounded-md transition-all lastik ${
            activeTab === 'content'
              ? 'bg-[#D4AF37] text-white'
              : 'bg-gray-50 text-gray-500 hover:text-gray-700'
          }`}
        >
          Content
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="space-y-2"
        >
          {filteredSections.map((section) => (
            <SidebarSection
              key={section.id}
              title={section.title}
              items={section.items}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              handleNavigation={handleNavigation}
              animatingItems={animatingItems}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </nav>
  );
}
