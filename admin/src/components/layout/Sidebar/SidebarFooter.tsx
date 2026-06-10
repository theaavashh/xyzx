'use client';

import { SidebarUserMenu } from './SidebarUserMenu';
import type { User } from '@/types';

interface SidebarFooterProps {
  user: User | null;
  userInitials: string;
  fullName: string;
  isProfileDropdownOpen: boolean;
  setProfileDropdownOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  onChangePassword: () => void;
  onManageProfile: () => void;
}

export function SidebarFooter({
  user,
  userInitials,
  fullName,
  isProfileDropdownOpen,
  setProfileDropdownOpen,
  onLogout,
  onChangePassword,
  onManageProfile,
}: SidebarFooterProps) {
  return (
    <div className="flex-shrink-0 border-t border-gray-200">
      <SidebarUserMenu
        user={user}
        userInitials={userInitials}
        fullName={fullName}
        isOpen={isProfileDropdownOpen}
        setIsOpen={setProfileDropdownOpen}
        onLogout={onLogout}
        onChangePassword={onChangePassword}
        onManageProfile={onManageProfile}
      />
    </div>
  );
}
