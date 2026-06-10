'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { NAVIGATION_SECTIONS, ROUTE_MAP, SECTIONS_WITH_CHILDREN } from '@/constants/navigation';

export const useNavigation = (
  isMobile: boolean,
  setSidebarOpen: (open: boolean) => void,
) => {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [animatingItems, setAnimatingItems] = useState<Record<string, boolean>>({});

  const toggleSection = useCallback((sectionId: string) => {
    setAnimatingItems((prev) => ({ ...prev, [sectionId]: true }));

    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );

    setTimeout(() => {
      setAnimatingItems((prev) => {
        const newState = { ...prev };
        delete newState[sectionId];
        return newState;
      });
    }, 300);
  }, []);

  const handleNavigation = useCallback(
    (itemId: string, parentId?: string) => {
      const route = ROUTE_MAP[itemId];

      if (route) {
        router.push(route);
      } else if (!parentId) {
        const section = NAVIGATION_SECTIONS.find(
          (navItem) => navItem.id === itemId,
        );
        if (section?.items?.length || SECTIONS_WITH_CHILDREN.has(itemId)) {
          toggleSection(itemId);
        }
      }

      if (isMobile) {
        setSidebarOpen(false);
      }
    },
    [router, toggleSection, isMobile, setSidebarOpen],
  );

  return {
    expandedSections,
    animatingItems,
    toggleSection,
    handleNavigation,
  };
};
