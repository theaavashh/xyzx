import type { NextConfig } from 'next';

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';
const apiUrl = new URL(apiBase);

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  experimental: {
    // optimizeCss: true,  // Disabled: causes hydration mismatches with Turbopack in Next 16
    // optimizePackageImports: ['lucide-react', '@tanstack/react-query', 'recharts', 'framer-motion'],
  },

  poweredByHeader: false,
  compress: true,
  generateEtags: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: apiUrl.hostname,
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9999',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiBase}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${apiBase}/uploads/:path*`,
      },
    ];
  },

  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
      ],
    },
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/fonts/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/:path*.(jpg|jpeg|png|webp|avif|ico|svg|woff|woff2)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400, stale-while-revalidate=86400',
        },
      ],
    },
  ],
};

function getConfig() {
  if (process.env.NODE_ENV !== 'production') return nextConfig;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { withSentryConfig } = require('@sentry/nextjs');
  return withSentryConfig(nextConfig, {
    org: process.env.SENTRY_ORG || 'rapharch',
    project: process.env.SENTRY_PROJECT || 'admin',
    silent: !process.env.CI,
    widenClientFileUpload: true,
    sourcemaps: { deleteSourcemapsAfterUpload: true },
    disableLogger: true,
  });
}

export default getConfig();
