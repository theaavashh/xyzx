import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { inter } from './fonts';
import AuthErrorHandler from '@/components/AuthErrorHandler';

const Providers = dynamic(
  () => import('@/providers/Providers').then((m) => m.Providers),
  { ssr: true },
);

export const metadata: Metadata = {
  title: {
    default: 'Rapharch Admin Dashboard',
    template: '%s | Rapharch Admin',
  },
  description: 'Admin dashboard for Rapharch e-commerce platform',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="/fonts" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="/fonts" />
      </head>
      <body className={`saans antialiased tracking-tight`}>
        <Providers>
          <AuthErrorHandler>
            <main id="main-content" role="main">
              {children}
            </main>
          </AuthErrorHandler>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 2000,
              style: {
                background: '#ffffff',
                color: '#111111',
              },
              success: {
                duration: 1500,
                iconTheme: {
                  primary: '#16a34a',
                  secondary: '#ffffff',
                },
              },
              error: {
                duration: 2000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
