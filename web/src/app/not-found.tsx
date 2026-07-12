import type { Metadata } from 'next';
import Link from 'next/link';
import { generateSEOMetadata } from '@/components/SEO';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  url: `${process.env.NEXT_PUBLIC_SITE_URL}/404`,
});

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 ">
      <div className="text-center max-w-md">
        <span className="text-[150px] leading-none font-bold text-black lastik select-none">
          404
        </span>
        <h1 className=" text-2xl font-semibold text-black mt-6 mb-3 uppercase lastik">
          Lost at sea?
        </h1>
        <p className="text-black text-lg font-medium mt-5 mb-3">
          The page you're looking for might be out of reach.
        </p>
        <p className="text-black text-lg mb-8 font-medium">
          Let us guide you back to the artistry and heritage of Rapharch
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-md font-medium "
        >
          Back to Home
        </Link>
      </div>
     
    </div>
  );
}