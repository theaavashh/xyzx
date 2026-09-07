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
  const page = await getContentPage('return-policy');

  if (!page) {
    return generateSEOMetadata({
      title: 'Return Policy',
      description:
        "Read RaphArch's return policy to learn how to return items and get refunds.",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/return-policy`,
    });
  }

  return generateSEOMetadata({
    title: page.metaTitle || page.title,
    description: page.metaDescription || `Read ${page.title} for RaphArch.`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/return-policy`,
  });
}

export default async function ReturnPolicyPage() {
  const page = await getContentPage('return-policy');

  if (!page || !page.isActive) {
    notFound();
  }

  const safeContent = await sanitizeHtml(page.content);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="bound-regular text-3xl sm:text-4xl text-zinc-900 mb-8">
            {page.title || 'Return Policy'}
          </h1>
          <div
            className="text-zinc-600 prose prose-lg max-w-none prose-headings:text-zinc-600 prose-h1:text-zinc-600 prose-p:text-zinc-600 prose-li:text-zinc-600 prose-strong:text-zinc-600"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />
        </div>
      </div>
    </div>
  );
}
