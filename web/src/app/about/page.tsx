'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { fetchVisitOurStore } from '@/components/VisitOurStore/utils/api';
import type { VisitOurStoreData } from '@/components/VisitOurStore/types';

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

export default function AboutPage() {
  const [store, setStore] = useState<VisitOurStoreData | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);

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

  return (
    <div className="min-h-screen bg-white">
      <section className="relative py-24 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 ring-1 ring-amber-400/20 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600">
                Who We Are
              </span>
            </div>
            <h1 className={`lastik text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6`}>
              {about?.title || 'About RaphArch'}
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-base lg:text-lg leading-relaxed">
              Premium fashion and footwear for the modern individual who demands quality, style, and authenticity.
            </p>
          </div>

          {about?.content && about.isActive ? (
            <div className="mb-20">
              <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900">
                <div
                  dangerouslySetInnerHTML={{ __html: about.content }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                <div>
                  <h2 className={`lastik text-3xl md:text-4xl text-gray-900 mb-6`}>
                    Our Story
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    RaphArch was founded with a simple yet powerful vision: to provide premium fashion and footwear that combines cutting-edge style with uncompromising quality. What started as a small passion project has grown into a trusted destination for fashion enthusiasts.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Our journey began when we noticed a gap in the market for high-quality, stylish footwear and apparel that truly understands the needs of the modern consumer. Today, RaphArch stands as a testament to our commitment to quality, authenticity, and customer satisfaction.
                  </p>
                </div>

                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100">
                  {data?.image && (
                    <Image
                      src={data.image}
                      alt="RaphArch Store"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized
                    />
                  )}
                </div>
              </div>

              <div className="mb-20">
                <h2 className={`lastik text-3xl text-gray-900 mb-8 text-center`}>
                  Core Values
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { title: 'Quality First', desc: 'Every product meets rigorous standards for materials, craftsmanship, and durability.' },
                    { title: 'Authenticity', desc: 'We work directly with brands and authorized distributors to ensure genuine products.' },
                    { title: 'Customer Focus', desc: 'Our customers are at the heart of everything we do, always.' },
                  ].map((value) => (
                    <div key={value.title} className="text-center p-6 rounded-2xl bg-gray-50">
                      <div className="w-14 h-14 rounded-xl bg-amber-400 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-6 h-6 text-black" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{value.title}</h3>
                      <p className="text-gray-500 text-sm">{value.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-20">
                <div className="bg-gray-900 text-white rounded-3xl p-12">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                      { number: '10K+', label: 'Happy Customers' },
                      { number: '500+', label: 'Products' },
                      { number: '50+', label: 'Brands' },
                      { number: '99%', label: 'Satisfaction' },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <div className={`lastik text-3xl md:text-4xl mb-1`}>{stat.number}</div>
                        <div className="text-gray-400 text-sm">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {data && (
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="lastik text-3xl text-gray-900 mb-6">
                  Visit Our Store
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <span className="text-gray-600">{fullAddress}</span>
                  </div>
                  {data.phone && (
                    <a href={`tel:${data.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
                      <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                      {data.phone}
                    </a>
                  )}
                  {data.email && (
                    <a href={`mailto:${data.email}`} className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
                      <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                      {data.email}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-center items-start gap-4">
                <p className="text-gray-600 leading-relaxed">
                  {data.description}
                </p>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-black font-bold rounded-xl hover:bg-amber-300 transition-colors text-sm"
                >
                  Get In Touch
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
          )}
        </div>
      </section>
    </div>
  );
}
