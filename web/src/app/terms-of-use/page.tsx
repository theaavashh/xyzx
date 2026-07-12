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
  const page = await getContentPage('terms-of-use');

  if (!page) {
    return generateSEOMetadata({
      title: 'Terms of Use',
      description:
        'Read RaphArch Terms of Use. Understand the terms and conditions governing your use of our website and services.',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/terms-of-use`,
    });
  }

  return generateSEOMetadata({
    title: page.metaTitle || page.title,
    description: page.metaDescription || `Read ${page.title} for RaphArch.`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/terms-of-use`,
  });
}

export default async function TermsOfUsePage() {
  const page = await getContentPage('terms-of-use');

  if (!page || !page.isActive) {
    notFound();
  }

  const safeContent = await sanitizeHtml(page.content);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div
            className="text-black prose prose-lg max-w-none prose-headings:text-black prose-h1:text-black prose-p:text-black prose-li:text-black prose-strong:text-black whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />
        </div>
      </div>
    </div>
  );
}
