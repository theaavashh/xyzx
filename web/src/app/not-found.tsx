import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { generateSEOMetadata } from '@/components/SEO';
import { Home, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  url: `${process.env.NEXT_PUBLIC_SITE_URL}/404`,
});

const images = ['/p1.webp', '/p2.webp', '/p3.webp', '/p4.webp', '/p5.webp'];

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 relative overflow-hidden py-12">
      <div className="flex flex-col items-center text-center">
        <span className="text-md font-medium text-zinc-400 uppercase  mb-6">Error 404</span>
        <h1 className={`text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight mb-3 lastik`}>Page not found</h1>
        <p className="text-md text-zinc-500 leading-relaxed mb-10 max-w-xs">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-black text-sm font-bold rounded-lg hover:bg-[#c9a32e] transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-zinc-200 text-zinc-700 text-sm font-medium rounded-md hover:bg-zinc-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
        </div>
        <div className="mt-12 w-full overflow-hidden">
          <div
            className="marquee-track flex gap-4"
            style={{ width: 'max-content', animation: 'scrollLeft 30s linear infinite' }}
          >
            {[...Array(4)].map((_, setIdx) =>
              images.map((src, i) => (
                <div key={`${setIdx}-${i}`} className="w-52 h-52 md:w-52 md:h-36 rounded-md overflow-hidden shrink-0">
                  <Image src={src} alt="" width={144} height={144} className="w-full h-full object-cover" />
                </div>
              ))
            )}
          </div>
        </div>
        <style>{`
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <div className="mt-10 pt-8 border-t border-zinc-100">
          <p className="text-md text-zinc-400 mb-3">Looking for something?</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/products" className="text-md text-zinc-500 hover:text-zinc-900 underline underline-offset-2 transition-colors">Products</Link>
            <span className="text-[11px] text-zinc-200">/</span>
            <Link href="/shipping" className="text-md text-zinc-500 hover:text-zinc-900 underline underline-offset-2 transition-colors">Shipping</Link>
            <span className="text-[11px] text-zinc-200">/</span>
            <Link href="/faq" className="text-md text-zinc-500 hover:text-zinc-900 underline underline-offset-2 transition-colors">FAQ</Link>
            <span className="text-md text-zinc-200">/</span>
            <Link href="/contact-us" className="text-md text-zinc-500 hover:text-zinc-900 underline underline-offset-2 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
