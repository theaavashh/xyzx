'use client';

import { X } from 'lucide-react';
import { bricolage } from '@/app/fonts';
import { SidebarFooter } from './SidebarFooter';
import { SidebarNav } from './SidebarNav';
import type { User } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  expandedSections: string[];
  toggleSection: (id: string) => void;
  handleNavigation: (itemId: string, parentId?: string) => void;
  animatingItems: Record<string, boolean>;
  user: User | null;
  userInitials: string;
  fullName: string;
  isProfileDropdownOpen: boolean;
  setProfileDropdownOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  onChangePassword: () => void;
  onManageProfile: () => void;
}

export function Sidebar({
  isOpen,
  setIsOpen,
  expandedSections,
  toggleSection,
  handleNavigation,
  animatingItems,
  user,
  userInitials,
  fullName,
  isProfileDropdownOpen,
  setProfileDropdownOpen,
  onLogout,
  onChangePassword,
  onManageProfile,
}: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
      <aside
        suppressHydrationWarning
        className={`bg-white border-r border-gray-200 flex flex-col w-72 flex-shrink-0 h-screen z-50 transition-transform duration-300 max-lg:fixed max-lg:inset-y-0 max-lg:left-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <SidebarHeader onClose={() => setIsOpen(false)} />
        <SidebarNav
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          handleNavigation={handleNavigation}
          animatingItems={animatingItems}
        />
        <SidebarFooter
          user={user}
          userInitials={userInitials}
          fullName={fullName}
          isProfileDropdownOpen={isProfileDropdownOpen}
          setProfileDropdownOpen={setProfileDropdownOpen}
          onLogout={onLogout}
          onChangePassword={onChangePassword}
          onManageProfile={onManageProfile}
        />
      </aside>
    </>
  );
}

function SidebarHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between h-14 px-3 border-b border-gray-200 flex-shrink-0">
      <span className={`text-2xl font-semibold text-black tracking-wide lastik text-center`}>
        Admin CMS
      </span>
      <button
        type="button"
        onClick={onClose}
        className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors lg:hidden"
        aria-label="Close sidebar"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
