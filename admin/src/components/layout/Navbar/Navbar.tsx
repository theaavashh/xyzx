'use client';

import { Menu, X } from 'lucide-react';
import type { User } from '@/contexts/AuthContextTanStack';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationBell } from '../NotificationBell/NotificationBell';
import { UserMenu } from '../UserMenu/UserMenu';

interface NavbarProps {
  title: string;
  showBackButton: boolean;
  onBack: () => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  user: User | null;
  userInitials: string;
  fullName: string;
  isProfileDropdownOpen: boolean;
  setProfileDropdownOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  onChangePassword: () => void;
  onManageProfile: () => void;
  handleNavigation: (itemId: string) => void;
}

export function Navbar({
  title,
  showBackButton,
  onBack,
  isSidebarOpen,
  setSidebarOpen,
  user,
  userInitials,
  fullName,
  isProfileDropdownOpen,
  setProfileDropdownOpen,
  onLogout,
  onChangePassword,
  onManageProfile,
  handleNavigation,
}: NavbarProps) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div>
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-md transition-colors text-black hover:text-black hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            {showBackButton && (
              <button
                type="button"
                onClick={onBack}
                className="p-2 rounded-md text-black hover:text-black hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-lg sm:text-2xl font-bold text-black truncate lastik tracking-wide">
              {title}
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <NotificationBell
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
            />
            {user?.email && (
              <span className="text-sm text-gray-800 truncate max-w-[200px]">
                {user.email}
              </span>
            )}
            <UserMenu
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
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 py-2 lg:hidden">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
          <button
            type="button"
            onClick={() => handleNavigation('all-products')}
            className="flex-shrink-0 px-3 py-2 text-xs font-bold text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            Products
          </button>
          <button
            type="button"
            onClick={() => handleNavigation('all-orders')}
            className="flex-shrink-0 px-3 py-2 text-xs font-bold text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            Orders
          </button>
          <button
            type="button"
            onClick={() => handleNavigation('all-customers')}
            className="flex-shrink-0 px-3 py-2 text-xs font-bold text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            Customers
          </button>
          <button
            type="button"
            onClick={() => handleNavigation('sales-analytics')}
            className="flex-shrink-0 px-3 py-2 text-xs font-bold text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
