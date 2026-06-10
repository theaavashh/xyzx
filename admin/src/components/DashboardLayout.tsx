'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContextTanStack';
import { useNavigation } from '@/hooks/useNavigation';
import { useScreenSize } from '@/hooks/useScreenSize';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ChangePasswordModal } from './layout/Modals/ChangePasswordModal';
import { ManageProfileModal } from './layout/Modals/ManageProfileModal';
import { Navbar } from './layout/Navbar/Navbar';
import { Sidebar } from './layout/Sidebar/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
}

export default function DashboardLayout({
  children,
  title = 'Dashboard',
  showBackButton = false,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [sidebarProfileDropdownOpen, setSidebarProfileDropdownOpen] =
    useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [manageProfileModalOpen, setManageProfileModalOpen] = useState(false);

  const router = useRouter();
  const { user, logout } = useAuth();
  const { isMobile } = useScreenSize();
  const { userInitials, fullName } = useUserProfile(user);
  const { expandedSections, animatingItems, toggleSection, handleNavigation } =
    useNavigation(isMobile, setSidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        setProfileDropdownOpen(false);
        setSidebarProfileDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (sidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen, isMobile]);

  return (
    <ProtectedRoute>
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          handleNavigation={handleNavigation}
          animatingItems={animatingItems}
          user={user}
          userInitials={userInitials}
          fullName={fullName}
          isProfileDropdownOpen={sidebarProfileDropdownOpen}
          setProfileDropdownOpen={setSidebarProfileDropdownOpen}
          onLogout={logout}
          onChangePassword={() => setChangePasswordModalOpen(true)}
          onManageProfile={() => setManageProfileModalOpen(true)}
        />

          <div className="flex-1 min-w-0 flex flex-col overflow-y-auto scrollbar-hide">
          <Navbar
            title={title}
            showBackButton={showBackButton}
            onBack={() => router.back()}
            isSidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            user={user}
            userInitials={userInitials}
            fullName={fullName}
            isProfileDropdownOpen={profileDropdownOpen}
            setProfileDropdownOpen={setProfileDropdownOpen}
            onLogout={logout}
           onChangePassword={() => setChangePasswordModalOpen(true)}
           onManageProfile={() => setManageProfileModalOpen(true)}
          handleNavigation={handleNavigation}
          />

          <main className="p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <ErrorBoundary>{children}</ErrorBoundary>
            </div>
          </main>
        </div>

        <ChangePasswordModal
          isOpen={changePasswordModalOpen}
          onClose={() => setChangePasswordModalOpen(false)}
        />
        <ManageProfileModal
          isOpen={manageProfileModalOpen}
          onClose={() => setManageProfileModalOpen(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
