import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/contexts/CartContext';
import CookieConsentModal from '@/components/CookieConsentModal';
import ConditionalLayout from '@/components/ConditionalLayout';
import TopBanner from '@/components/TopBanner';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { AuthProvider } from '@/contexts/AuthContextTanStack';
import { inter, poppins } from './fonts';
import { LenisProvider } from '@/components/LenisProvider';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: {
    default: 'RaphArch - Premium Fashion & Footwear',
    template: '%s | RaphArch',
  },
  description:
    'Discover the latest in premium fashion, footwear, and accessories at RaphArch. Shop our collection of high-quality sneakers, clothing, and more with fast shipping and easy returns.',
  keywords: [
    'fashion',
    'footwear',
    'sneakers',
    'clothing',
    'accessories',
    'premium',
    'quality',
    'style',
    'trends',
  ],
  authors: [{ name: 'RaphArch' }],
  creator: 'RaphArch',
  publisher: 'RaphArch',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rapharch.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://rapharch.com',
    title: 'RaphArch - Premium Fashion & Footwear',
    description:
      'Discover the latest in premium fashion, footwear, and accessories at RaphArch',
    siteName: 'RaphArch',
    images: [
      {
        url: '/raphard-logo.png',
        width: 1200,
        height: 630,
        alt: 'RaphArch - Premium Fashion & Footwear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RaphArch - Premium Fashion & Footwear',
    description:
      'Discover the latest in premium fashion, footwear, and accessories at RaphArch',
    images: ['/raphard-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Performance and security headers */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="RaphArch" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://cdn.shopify.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//cdn.shopify.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />

        {/* Favicon and icons */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`swansea antialiased`}>
        <LenisProvider>
          <AuthProvider>
            <CartProvider>
              <TopBanner />
              <ConditionalLayout>{children}</ConditionalLayout>
              {/* <WhatsAppButton /> */}
              <CookieConsentModal />
              <ServiceWorkerRegister />
            </CartProvider>
          </AuthProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
