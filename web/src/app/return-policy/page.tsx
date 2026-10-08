import type { Metadata } from 'next';
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

const DEFAULT_TITLE = 'Return Policy';

const DEFAULT_CONTENT = `
<h2>30-Day Returns</h2>
<p>We want you to love your purchase. If you are not completely satisfied, you can return or exchange any item within 30 days of delivery.</p>
<h2>Return Conditions</h2>
<ul>
  <li>Items must be unworn, unwashed, and in original condition.</li>
  <li>Original tags must still be attached.</li>
  <li>Items should be returned in their original packaging where possible.</li>
  <li>Proof of purchase (order number or receipt) is required.</li>
</ul>
<h2>Items We Cannot Accept</h2>
<ul>
  <li>Worn, washed, or altered items.</li>
  <li>Items without original tags.</li>
  <li>Items damaged due to customer misuse.</li>
  <li>Final sale or clearance items.</li>
  <li>Underwear and swimwear, for hygiene reasons.</li>
  <li>Gift cards and downloadable products.</li>
</ul>
<h2>How to Start a Return</h2>
<ol>
  <li>Contact our customer service team with your order number, or open the order in your account and select &ldquo;Return Items.&rdquo;</li>
  <li>Pack the item securely, including all tags and accessories.</li>
  <li>Ship the return using the label provided, or drop it off at the agreed location.</li>
  <li>Once we receive and inspect your return, we will process your refund or exchange.</li>
</ol>
<h2>Refunds</h2>
<p>Refunds are issued to the original payment method. Please allow 2&ndash;3 business days for inspection after we receive your return, plus 5&ndash;7 business days for your bank to process the refund. You will receive an email confirmation once your refund has been issued.</p>
<p>Original shipping charges are non-refundable unless the item was faulty or incorrectly shipped.</p>
<h2>Exchanges</h2>
<p>Exchanges for a different size or colour are free within Australia and are subject to availability. If the requested item is out of stock, we will issue a refund instead.</p>
<h2>Damaged or Faulty Items</h2>
<p>Please inspect your order on arrival. If an item arrives damaged, faulty, or incorrect, contact us within 48 hours with photos of the item and packaging. We will replace it at no cost or provide a full refund, including shipping.</p>
<h2>Contact Us</h2>
<p>If you have any questions about a return, reach out via our <a href="/contact-us">contact page</a> and our team will help you every step of the way.</p>
`;

async function getContentPage(slug: string): Promise<ContentPage | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiUrl) return null;

    const response = await fetch(`${apiUrl}/api/v1/content/slug/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data ?? null;
  } catch (error) {
    console.error('Error fetching content page:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContentPage('return-policy');

  if (!page || !page.isActive) {
    return generateSEOMetadata({
      title: DEFAULT_TITLE,
      description:
        "Read RaphArch's return policy to learn how to return items, start an exchange, and get a refund.",
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
  const useCms = Boolean(page && page.isActive);

  const title = useCms && page ? page.title || DEFAULT_TITLE : DEFAULT_TITLE;
  const content = useCms && page ? page.content : DEFAULT_CONTENT;

  const safeContent = await sanitizeHtml(content);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="bound-regular text-3xl sm:text-4xl text-zinc-900 mb-8">
            {title}
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
