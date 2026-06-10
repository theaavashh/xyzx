'use client';

import { useAuth } from '@/contexts/AuthContextTanStack';
import { Package, Heart, MapPin, Settings, LogOut, LayoutGrid, ChevronDown, ChevronRight, RotateCcw, XCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const sidebarLinks = [
  { href: '/dashboard', label: 'My Overview', icon: LayoutGrid },
  {
    href: '/dashboard/orders',
    label: 'My Orders',
    icon: Package,
    children: [
      { href: '/dashboard/orders/returns', label: 'My Returns', icon: RotateCcw },
      { href: '/dashboard/orders/cancellations', label: 'My Cancellations', icon: XCircle },
    ],
  },
  { href: '/dashboard/wishlist', label: 'My Wishlist', icon: Heart },
  { href: '/dashboard/addresses', label: 'My Addresses', icon: MapPin },
  { href: '/dashboard/settings', label: 'My Settings', icon: Settings },
];

interface SidebarProps {
  mobile?: boolean;
  pathname: string;
  expandedSections: Record<string, boolean>;
  onToggleSection: (href: string) => void;
  onNavigate: () => void;
  onLogout: () => void;
  username: string;
}

const Sidebar = function Sidebar({ mobile = false, pathname, expandedSections, onToggleSection, onNavigate, onLogout, username }: SidebarProps) {
  return (
    <div className={`flex flex-col h-full ${mobile ? '' : 'bg-transparent'}`}>
      <div className="p-6 text-center border-b border-gray-100">
        <p className={`lastik text-gray-900 text-2xl uppercase tracking-tight`}>
          Hello, {username}
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          const hasChildren = link.children && link.children.length > 0;
          const isExpanded = expandedSections[link.href] || false;
          const isChildActive = hasChildren && link.children?.some((child) => pathname === child.href);

          return (
            <div key={link.href}>
              {hasChildren ? (
                <>
                  <button
                    onClick={() => onToggleSection(link.href)}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-base transition-all duration-200 ${
                      isActive || isChildActive
                        ? 'bg-[#D4AF37] text-white'
                        : 'text-gray-500 hover:bg-[#D4AF37]/10 hover:text-gray-900'
                    } ${isActive || isChildActive ? 'rounded-t-lg' : 'rounded-lg'}`}
                    aria-expanded={isExpanded}
                    aria-controls={`section-${link.href}`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{link.label}</span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div id={`section-${link.href}`} className="ml-4 mt-0.5 space-y-0.5 border-l border-gray-100 pl-4">
                      {link.children?.map((child) => {
                        const ChildIcon = child.icon;
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={onNavigate}
                            className={`flex items-center gap-3 px-3 py-2.5 text-base rounded-lg transition-all duration-200 ${
                              isChildActive
                                ? 'bg-[#D4AF37] text-white'
                                : 'text-gray-500 hover:bg-[#D4AF37]/10 hover:text-gray-900'
                            }`}
                          >
                            <ChildIcon className="h-4 w-4 flex-shrink-0" />
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className={`w-full flex items-center gap-3 px-3 py-3 text-base transition-all duration-200 rounded-lg ${
                    isActive
                      ? 'bg-[#D4AF37] text-white'
                      : 'text-gray-500 hover:bg-[#D4AF37]/10 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{link.label}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-3 w-full px-3 py-3 text-base text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span>Sign Out</span>
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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    '/dashboard/orders': true,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleToggleSection = useCallback((href: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  }, []);

  const handleNavigate = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const sidebarProps = useMemo(
    () => ({
      pathname,
      expandedSections,
      onToggleSection: handleToggleSection,
      onNavigate: handleNavigate,
      onLogout: handleLogout,
      username: user?.firstName || user?.username || '',
    }),
    [pathname, expandedSections, handleToggleSection, handleNavigate, handleLogout, user?.firstName, user?.username],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F8FF]">
      <div className="lg:flex lg:min-h-screen">
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-0 h-screen pl-4 py-6">
            <Sidebar {...sidebarProps} />
          </div>
        </aside>

        <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <h1 className={`lastik text-gray-900 text-base uppercase`}>Dashboard</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-5 h-5 flex flex-col justify-center gap-1.5" role="img" aria-hidden="true">
              <span className={`block h-0.5 w-5 bg-gray-600 transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-5 bg-gray-600 transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-gray-600 transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="absolute inset-y-0 left-0 w-80 bg-white" onClick={(e) => e.stopPropagation()}>
              <div className="h-full pt-14">
                <Sidebar mobile {...sidebarProps} />
              </div>
            </div>
          </div>
        )}

        <main className="flex-1">
          <div className="max-w-full mx-auto px-4 sm:px-8 lg:px-12 py-6 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
