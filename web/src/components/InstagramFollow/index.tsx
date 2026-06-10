import Image from 'next/image';
import Link from 'next/link';
import { Instagram } from 'lucide-react';

const instagramImages = [
  { src: '/c1.avif', alt: 'Instagram post 1' },
  { src: '/c2.avif', alt: 'Instagram post 2' },
  { src: '/c3.avif', alt: 'Instagram post 3' },
  { src: '/c4.avif', alt: 'Instagram post 4' },
  { src: '/c6.avif', alt: 'Instagram post 5' },
  { src: '/p1.webp', alt: 'Instagram post 6' },
];

export default function InstagramFollow() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Instagram className="w-6 h-6 text-gray-900" />
            <h2 className={`lastik text-2xl sm:text-3xl text-gray-900`}>
              Follow Us on Instagram
            </h2>
          </div>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Tag <span className="font-semibold text-gray-700">@rapharch</span> to get featured
          </p>
        </div>

        <div
          className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {instagramImages.map((img, index) => (
            <a
              key={index}
              href="https://instagram.com/rapharch"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-64 sm:w-72 aspect-square flex-shrink-0 overflow-hidden relative group"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="288px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="https://instagram.com/rapharch"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black rounded-full hover:bg-[#c9a32e] transition-colors duration-300 text-sm font-bold"
          >
            <Instagram className="w-5 h-5" />
            Follow @rapharch
          </Link>
        </div>
      </div>
    </section>
  );
}
