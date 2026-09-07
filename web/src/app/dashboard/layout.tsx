'use client';

import { useAuth } from '@/contexts/AuthContextTanStack';
import { Package, MapPin, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const sidebarLinks = [
  {
    href: '/dashboard/orders',
    label: 'Orders',
    icon: Package,
  },
  { href: '/dashboard/addresses', label: 'Addresses', icon: MapPin },
];

interface SidebarProps {
  mobile?: boolean;
  pathname: string;
  onNavigate: () => void;
  onLogout: () => void;
}

const Sidebar = function Sidebar({ mobile = false, pathname, onNavigate, onLogout }: SidebarProps) {
  return (
    <div className={`flex flex-col h-full ${mobile ? '' : 'bg-transparent'}`}>
      <nav className="flex-1 py-4 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`w-full flex items-center gap-3 px-6 py-3 text-[13px] transition-colors ${
                isActive
                  ? 'text-zinc-600'
                  : 'text-zinc-600 hover:text-zinc-600'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="uppercase tracking-wider">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 py-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-6 py-3 text-[13px] text-zinc-600 hover:text-red-500 transition-colors"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span className="uppercase tracking-[0.1em]">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleNavigate = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const sidebarProps = useMemo(
    () => ({
      pathname,
      onNavigate: handleNavigate,
      onLogout: handleLogout,
    }),
    [pathname, handleNavigate, handleLogout],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-0.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gray-900 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="lg:flex lg:min-h-screen ">
        <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-gray-100">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <Sidebar {...sidebarProps} />
          </div>
        </aside>

        <div className="lg:hidden bg-white border-b border-gray-100 px-6 py-8 sticky top-0 z-40">
          <p className="text-2xl text-zinc-600 tracking-wide mb-1">Welcome, {user?.firstName || user?.username}</p>
          <div className="flex items-center justify-between mt-4">
            <h1 className="text-base font-medium text-zinc-600 uppercase tracking-wide">Dashboard</h1>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className="w-5 h-5 flex flex-col justify-center gap-1.5" role="img" aria-hidden="true">
                <span className={`block h-px w-5 bg-black transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
                <span className={`block h-px w-5 bg-black transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-px w-5 bg-black transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
              </div>
            </button>
          </div>
          {isMobileMenuOpen && (
            <div className="mt-4 pb-4 border-t border-gray-100 pt-4">
              <Sidebar mobile {...sidebarProps} />
            </div>
          )}
        </div>

        <main className="flex-1">
          <div className="px-6 sm:px-10 lg:px-16 py-10 lg:py-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}