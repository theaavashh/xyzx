'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/constants/navigation';
import { ROUTE_MAP } from '@/constants/navigation';

interface SidebarItemProps {
  item: NavItem;
  isCollapsed: boolean;
  expandedSections: string[];
  toggleSection: (id: string) => void;
  handleNavigation: (itemId: string, parentId?: string) => void;
  animatingItems: Record<string, boolean>;
}

export function SidebarItem({
  item,
  isCollapsed,
  expandedSections,
  toggleSection,
  handleNavigation,
}: SidebarItemProps) {
  const pathname = usePathname();
  const Icon = item.icon;
  const isExpanded = expandedSections.includes(item.id);
  const hasChildren = item.children && item.children.length > 0;
  const route = ROUTE_MAP[item.id];
  const isActive = route ? pathname === route || pathname.startsWith(route + '/') : false;

  return (
    <div suppressHydrationWarning>
      <button
        title={item.label}
        onClick={() => {
          if (isCollapsed && hasChildren) {
            const targetId = ROUTE_MAP[item.id]
              ? item.id
              : (item.children?.[0]?.id ?? item.id);
            handleNavigation(targetId);
          } else if (hasChildren) {
            toggleSection(item.id);
          } else {
            handleNavigation(item.id);
          }
        }}
        className={`w-full flex items-center px-3 py-2 text-lg font-medium rounded-md transition-all relative ${
          isCollapsed ? 'lg:justify-center' : ''
        } ${
          isActive
            ? 'text-gray-900 bg-gray-100'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-full" />}
        <Icon className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? 'lg:mr-0' : 'mr-3'} mr-3`} />
        <span className={`flex-1 text-left text-xl tracking-normal truncate ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
        {hasChildren && (
          <ChevronRight
            className={`w-4 h-4 flex-shrink-0 transition-transform duration-150 ${
              isExpanded ? 'rotate-90' : ''
            } ${isCollapsed ? 'lg:hidden' : ''}`}
          />
        )}
      </button>

      <AnimatePresence>
        {!isCollapsed && hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="ml-5 border-l border-gray-200 overflow-hidden"
          >
            <div className="space-y-0.5">
              {item.children?.map((child, idx) => {
                const ChildIcon = child.icon;
                const isChildActive = pathname.includes(child.id);
                const isLast = idx === (item.children?.length ?? 0) - 1;

                return (
                  <motion.div
                    key={child.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className="relative"
                  >
                    <div className={`absolute left-0 top-0 w-3 border-l-2 border-gray-900 ${isLast ? 'h-4 rounded-bl-lg' : 'h-full'}`} />
                    <div className="absolute left-0 top-3 w-3 border-t-2 border-gray-900" />
                    <button
                      onClick={() => handleNavigation(child.id, item.id)}
                      className={`w-full flex items-center py-1.5 pl-6 pr-2 text-lg font-medium rounded-md transition-all ${
                        isChildActive
                          ? 'text-gray-900 bg-gray-100'
                          : 'text-gray-800 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <ChildIcon className="w-4 h-4 mr-2 flex-shrink-0 text-gray-600" />
                      <span className="truncate text-lg">{child.label}</span>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
