import type { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

export function generateSEOMetadata(props: SEOProps = {}): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = '/raphard-logo.png',
    url = process.env.NEXT_PUBLIC_SITE_URL || 'https://rapharch.com',
    type = 'website',
    noIndex = false,
  } = props;

  const fullTitle = title
    ? `${title} | RaphArch`
    : 'RaphArch - Premium Fashion & Footwear';

  return {
    title: fullTitle,
    description:
      description ||
      'Discover the latest in premium fashion, footwear, and accessories at RaphArch. Shop our collection of high-quality sneakers, clothing, and more with fast shipping and easy returns.',
    keywords: keywords.join(', '),
    authors: [{ name: 'RaphArch' }],
    creator: 'RaphArch',
    publisher: 'RaphArch',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rapharch.com'),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: 'en_US',
      url,
      title: fullTitle,
      description:
        description ||
        'Discover the latest in premium fashion, footwear, and accessories at RaphArch',
      siteName: 'RaphArch',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description:
        description ||
        'Discover the latest in premium fashion, footwear, and accessories at RaphArch',
      images: [image],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function StructuredData({ children }: { children: React.ReactNode }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(children) }}
    />
  );
}
