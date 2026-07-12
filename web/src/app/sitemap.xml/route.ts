import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rapharch.com';
  const currentDate = new Date().toISOString().split('T')[0];

  const staticPages = [
    {
      url: '',
      changefreq: 'daily',
      priority: '1.0',
    },
    {
      url: '/products',
      changefreq: 'daily',
      priority: '0.9',
    },
    {
      url: '/products/shoes',
      changefreq: 'weekly',
      priority: '0.8',
    },
    {
      url: '/products/clothing',
      changefreq: 'weekly',
      priority: '0.8',
    },
    {
      url: '/products/accessories',
      changefreq: 'weekly',
      priority: '0.8',
    },
    {
      url: '/cart',
      changefreq: 'monthly',
      priority: '0.7',
    },
    {
      url: '/checkout',
      changefreq: 'monthly',
      priority: '0.7',
    },
    {
      url: '/login',
      changefreq: 'monthly',
      priority: '0.6',
    },
    {
      url: '/auth/signup',
      changefreq: 'monthly',
      priority: '0.6',
    },
    {
      url: '/auth/forgot-password',
      changefreq: 'yearly',
      priority: '0.5',
    },
    {
      url: '/rewards',
      changefreq: 'weekly',
      priority: '0.7',
    },
    {
      url: '/contact-us',
      changefreq: 'quarterly',
      priority: '0.6',
    },
    {
      url: '/privacy-policy',
      changefreq: 'quarterly',
      priority: '0.5',
    },
    {
      url: '/terms-of-use',
      changefreq: 'quarterly',
      priority: '0.5',
    },
    {
      url: '/refund',
      changefreq: 'quarterly',
      priority: '0.5',
    },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
    )
    .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
