import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateSEOMetadata } from '@/components/SEO';
import { sanitizeHtml } from '@/lib/sanitize';

interface ContentPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  isActive: boolean;
}

async function getContentPage(slug: string): Promise<ContentPage | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiUrl) {
      console.error('API_BASE_URL is not defined');
      return null;
    }

    const response = await fetch(`${apiUrl}/api/v1/content/slug/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching content page:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContentPage('cookie-policy');

  if (!page) {
    return generateSEOMetadata({
      title: 'Cookie Policy',
      description:
        'Learn about how RaphArch uses cookies and similar technologies.',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/cookie-policy`,
    });
  }

  return generateSEOMetadata({
    title: page.metaTitle || page.title,
    description: page.metaDescription || `Read ${page.title} for RaphArch.`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/cookie-policy`,
  });
}

export default async function CookiePolicyPage() {
  const page = await getContentPage('cookie-policy');

  if (!page || !page.isActive) {
    notFound();
  }

  const safeContent = await sanitizeHtml(page.content);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <span className="inline-block text-black/30 text-xs font-semibold tracking-[0.25em] uppercase mb-6 border-l-2 border-black/30 pl-4">
          Cookies
        </span>
        <h1 className="lastik text-3xl sm:text-4xl md:text-5xl text-black mb-8">{page.title}</h1>
        <div
          className="prose prose-lg max-w-none prose-headings:text-black prose-h1:text-black prose-p:text-black/60 prose-li:text-black/60 prose-strong:text-black prose-a:text-black prose-a:no-underline hover:prose-a:underline whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />
      </div>
    </div>
  );
}
