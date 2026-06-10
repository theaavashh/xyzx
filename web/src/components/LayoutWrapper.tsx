'use client';

import { usePathname } from 'next/navigation';
import FooterServer from '@/components/FooterServer';
import Navbar from '@/components/Navbar';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  const isHomePage = pathname === '/';
  const isDashboardPage = pathname?.startsWith('/dashboard');

  return (
    <>
      {!isAuthPage && !isHomePage && <Navbar />}
      {children}
      {!isAuthPage && !isDashboardPage && <FooterServer />}
    </>
  );
}
