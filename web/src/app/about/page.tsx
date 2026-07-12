'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, ArrowRight, Award, Shield, Heart } from 'lucide-react';
import { fetchVisitOurStore } from '@/components/VisitOurStore/utils/api';
import type { VisitOurStoreData } from '@/components/VisitOurStore/types';
import DOMPurify from 'dompurify';

interface AboutContent {
  title: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  isActive: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

async function fetchAboutContent(): Promise<AboutContent | null> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/content/slug/about`);
    if (!response.ok) return null;
    const result = await response.json();
    return result.data;
  } catch {
    return null;
  }
}

const statNumbers = [
  { number: '10K+', label: 'Happy Customers' },
  { number: '500+', label: 'Products' },
  { number: '50+', label: 'Brands' },
  { number: '99%', label: 'Satisfaction' },
];

const coreValues = [
  {
    title: 'Quality First',
    desc: 'Every product meets rigorous standards for materials, craftsmanship, and durability.',
    icon: Award,
  },
  {
    title: 'Authenticity',
    desc: 'We work directly with brands and authorized distributors to ensure genuine products.',
    icon: Shield,
  },
  {
    title: 'Customer Focus',
    desc: 'Our customers are at the heart of everything we do, always.',
    icon: Heart,
  },
];

export default function AboutPage() {
  const [store, setStore] = useState<VisitOurStoreData | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const result = await fetchVisitOurStore();
        if (mounted) setStore(result);
      } catch {
        if (mounted) setStore(null);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const result = await fetchAboutContent();
      if (mounted) setAbout(result);
    }
    load();
    return () => { mounted = false; };
  }, []);

  const data = store?.isActive ? store : null;
  const fullAddress = data ? `${data.address}, ${data.city}, ${data.state} ${data.zip}` : '';
  const hasImage = data?.image;

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Hero Image at Top ─── */}
      <div className="relative h-[50vh] md:h-[65vh] lg:h-[75vh] w-full overflow-hidden bg-gray-100">
        {hasImage ? (
          <>
            <Image
              src={data.image}
              alt="RaphArch Store"
              fill
              className={`object-cover transition-all duration-[1.5s] ease-out ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
              sizes="100vw"
              priority
              unoptimized
              onLoad={() => setImageLoaded(true)}
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 animate-pulse-soft" />
              <div className="h-4 w-40 mx-auto bg-gray-200 rounded animate-pulse-soft" />
            </div>
          </div>
        )}

        {/* Title overlay on image */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20">
            <div className={`max-w-3xl transition-all duration-[1.2s] delay-300 ease-out ${imageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-block text-white/60 text-xs font-semibold tracking-[0.25em] uppercase mb-4 border-l-2 border-white/40 pl-4">
                About Us
              </span>
              <h1 className="lastik text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 leading-tight drop-shadow-lg">
                {about?.title || 'About RaphArch'}
              </h1>
              <p className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed tracking-wide">
                Premium fashion and footwear for the modern individual who demands quality, style, and authenticity.
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:block">
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div ref={contentRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {about?.content && about.isActive ? (
          /* CMS Content */
          <section className="py-20 md:py-28">
            <div className="prose prose-lg max-w-none prose-headings:text-black prose-p:text-black/50 prose-li:text-black/50 prose-strong:text-black">
              <div
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(about.content, { ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'pre', 'code', 'hr', 'span', 'div', 'section', 'sup', 'sub', 'small', 'table', 'thead', 'tbody', 'tr', 'th', 'td'], ALLOW_DATA_ATTR: false }) }}
              />
            </div>
          </section>
        ) : (
          /* Default Content */
          <>
            {/* ─── Our Story ─── */}
            <section className="py-20 md:py-28 animate-fade-in-up">
              <div className="max-w-3xl mx-auto text-center">
                <span className="inline-block text-black/30 text-xs font-semibold tracking-[0.25em] uppercase mb-4 border-l-2 border-black/30 pl-4">
                  Our Story
                </span>
                <h2 className="lastik text-3xl md:text-4xl lg:text-5xl text-black mb-8 leading-tight">
                  Founded with a vision<br />for <span className="italic text-black/40">quality</span>
                </h2>
                <div className="space-y-6 max-w-2xl mx-auto">
                  <p className="text-black/50 leading-relaxed text-base md:text-lg">
                    RaphArch was founded with a simple yet powerful vision: to provide premium fashion and footwear that combines cutting-edge style with uncompromising quality. What started as a small passion project has grown into a trusted destination for fashion enthusiasts.
                  </p>
                  <p className="text-black/50 leading-relaxed text-base md:text-lg">
                    Our journey began when we noticed a gap in the market for high-quality, stylish footwear and apparel that truly understands the needs of the modern consumer. Today, RaphArch stands as a testament to our commitment to quality, authenticity, and customer satisfaction.
                  </p>
                </div>

                {/* Decorative divider */}
                <div className="flex items-center justify-center gap-3 mt-12">
                  <span className="w-12 h-px bg-black/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-black/30" />
                  <span className="w-12 h-px bg-black/20" />
                </div>
              </div>
            </section>

            {/* ─── Stats ─── */}
            <section className="py-20 md:py-24 border-t border-black/10 animate-fade-in-up">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {statNumbers.map((stat, i) => (
                  <div
                    key={stat.label}
                    className="text-center group relative"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="lastik text-4xl md:text-5xl lg:text-6xl text-black mb-2 transition-all duration-500 group-hover:scale-110">
                      {stat.number}
                    </div>
                    <div className="text-black/40 text-xs tracking-widest uppercase font-medium">
                      {stat.label}
                    </div>
                    {/* Decorative dot on hover */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            </section>

            {/* ─── Core Values ─── */}
            <section className="py-20 md:py-28 border-t border-black/10 animate-fade-in-up">
              <div className="text-center mb-16">
                <span className="inline-block text-black/30 text-xs font-semibold tracking-[0.25em] uppercase mb-4 border-l-2 border-black/30 pl-4">
                  Principles
                </span>
                <h2 className="lastik text-3xl md:text-4xl lg:text-5xl text-black">
                  Core Values
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {coreValues.map((value, i) => {
                  const Icon = value.icon;
                  return (
                    <div
                      key={value.title}
                      className="group relative bg-white border border-black/10 p-8 md:p-10 hover:border-black/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                      style={{ animationDelay: `${i * 150}ms` }}
                    >
                      {/* Accent line */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                      <div className="w-14 h-14 rounded-full bg-black/5 flex items-center justify-center mb-6 group-hover:bg-black/10 transition-all duration-300 group-hover:scale-110">
                        <Icon className="w-6 h-6 text-black/60 group-hover:text-black transition-colors duration-300" />
                      </div>

                      <h3 className="text-xl font-semibold text-black mb-3 group-hover:translate-x-1 transition-transform duration-300">{value.title}</h3>
                      <p className="text-black/40 text-sm leading-relaxed">{value.desc}</p>

                      {/* Corner decoration on hover */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                        <ArrowRight className="w-4 h-4 text-black/30" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ─── Banner Image ─── */}
            <section className="py-12 md:py-16 animate-fade-in-up">
              <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
                <Image
                  src="/raphard-main-banner.webp"
                  alt="RaphArch"
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </section>
          </>
        )}

        {/* ─── Visit Us ─── */}
        {data && (
          <section className="py-20 md:py-28 border-t border-black/10 animate-fade-in-up">
            <div className="grid md:grid-cols-5 gap-12 md:gap-16">
              {/* Left - Info */}
              <div className="md:col-span-3">
                <span className="inline-block text-black/30 text-xs font-semibold tracking-[0.25em] uppercase mb-4 border-l-2 border-black/30 pl-4">
                  Visit Us
                </span>
                <h2 className="lastik text-3xl md:text-4xl lg:text-5xl text-black mb-8">
                  Our Store
                </h2>

                <p className="text-black/50 text-sm md:text-base leading-relaxed mb-8 max-w-md">
                  {data.description}
                </p>

                <div className="space-y-5">
                  <div className="flex items-start gap-4 group">
                    <span className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0 group-hover:bg-black/10 transition-all duration-300 group-hover:scale-110">
                      <MapPin className="w-4 h-4 text-black/50 group-hover:text-black transition-colors duration-300" />
                    </span>
                    <div>
                      <span className="block text-xs font-medium text-black/40 uppercase tracking-wider mb-0.5">Address</span>
                      <span className="text-black text-sm">{fullAddress}</span>
                    </div>
                  </div>

                  {data.phone && (
                    <a href={`tel:${data.phone.replace(/\s/g, '')}`} className="flex items-start gap-4 group">
                      <span className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0 group-hover:bg-black/10 transition-all duration-300 group-hover:scale-110">
                        <Phone className="w-4 h-4 text-black/50 group-hover:text-black transition-colors duration-300" />
                      </span>
                      <div>
                        <span className="block text-xs font-medium text-black/40 uppercase tracking-wider mb-0.5">Phone</span>
                        <span className="text-black text-sm group-hover:text-black/60 transition-colors">{data.phone}</span>
                      </div>
                    </a>
                  )}

                  {data.email && (
                    <a href={`mailto:${data.email}`} className="flex items-start gap-4 group">
                      <span className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0 group-hover:bg-black/10 transition-all duration-300 group-hover:scale-110">
                        <Mail className="w-4 h-4 text-black/50 group-hover:text-black transition-colors duration-300" />
                      </span>
                      <div>
                        <span className="block text-xs font-medium text-black/40 uppercase tracking-wider mb-0.5">Email</span>
                        <span className="text-black text-sm group-hover:text-black/60 transition-colors">{data.email}</span>
                      </div>
                    </a>
                  )}
                </div>
              </div>

              {/* Right - CTA */}
              <div className="md:col-span-2 flex flex-col justify-center">
                <div className="bg-black/5 p-8 md:p-10 rounded-sm hover:bg-black/[0.07] transition-colors duration-300">
                  <h3 className="lastik text-2xl text-black mb-3">Get in Touch</h3>
                  <p className="text-black/50 text-sm leading-relaxed mb-6">
                    Have a question or just want to say hello? We&apos;d love to hear from you.
                  </p>
                  <Link
                    href="/contact-us"
                    className="group inline-flex items-center gap-3 px-6 py-3 bg-black text-white text-sm font-medium hover:bg-black/80 transition-all duration-300"
                  >
                    Contact Us
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Bottom spacing */}
        <div className="h-16" />
      </div>
    </div>
  );
}
