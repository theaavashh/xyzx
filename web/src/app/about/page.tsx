'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';

interface AboutPageData {
  // Hero
  heroImage: string | null;
  heroSubtitle: string | null;
  heroTagline: string | null;
  // Story
  storyTitle: string | null;
  storyContent: string | null;
  storyImage: string | null;
  // Pull quote
  pullQuote: string | null;
  // Video
  videoUrl: string | null;
  videoOverlayText: string | null;
  // Banner
  bannerImage: string | null;
  bannerText: string | null;
  // Store
  storeDescription: string | null;
  storeAddress: string | null;
  storeCity: string | null;
  storeState: string | null;
  storeZip: string | null;
  storePhone: string | null;
  storeEmail: string | null;
}

interface AboutContent {
  title: string;
  content: string;
  isActive: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

async function fetchAboutPage(): Promise<AboutPageData | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/public/about/active`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

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

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function AboutPage() {
  const [pageData, setPageData] = useState<AboutPageData | null>(null);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const [page, content] = await Promise.all([fetchAboutPage(), fetchAboutContent()]);
      if (mounted) {
        setPageData(page);
        setAboutContent(content);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // Build store address
  const storeParts = [pageData?.storeAddress, pageData?.storeCity, pageData?.storeState, pageData?.storeZip].filter(Boolean);
  const fullAddress = storeParts.join(', ') || '';
  const hasHeroImage = !!pageData?.heroImage;

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Hero Image at Top ─── */}
      <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] w-full overflow-hidden bg-gray-100">
        {hasHeroImage ? (
          <>
            <Image
              src={pageData!.heroImage!}
              alt="RaphArch Store"
              fill
              className={`object-cover transition-all duration-[1.5s] ease-out ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
              sizes="100vw"
              priority
              unoptimized
              onLoad={() => setImageLoaded(true)}
            />
 
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-4 w-40 mx-auto bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        )}

        {/* Title overlay on image */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20">
            <div className={`max-w-3xl transition-all duration-[1.2s] delay-300 ease-out ${imageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.55, ease: 'easeOut' }}
                className="bound-regular text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl  mb-2 leading-tight drop-shadow-sm"
              >
                {aboutContent?.title || 'About RaphArch'}
              </motion.h1>
              {pageData?.heroSubtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.75, ease: 'easeOut' }}
                  className=" text-base md:text-lg max-w-xl leading-relaxed tracking-wide"
                >
                  {pageData.heroSubtitle}
                </motion.p>
              )}
              {pageData?.heroTagline && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.95, ease: 'easeOut' }}
                  className="font-playfair italic  text-sm md:text-base mt-3"
                >
                  {pageData.heroTagline}
                </motion.p>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:block">
          <div className="w-5 h-8 border-2 border-black/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-black/50 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div ref={contentRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {aboutContent?.content && aboutContent.isActive ? (
          /* CMS Content */
          <section className="py-20 md:py-28">
            <div className="prose prose-lg max-w-none prose-headings:text-zinc-600 prose-p:text-zinc-600/50 prose-li:text-zinc-600/50 prose-strong:text-zinc-600">
              <div
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(aboutContent.content, { ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'pre', 'code', 'hr', 'span', 'div', 'section', 'sup', 'sub', 'small', 'table', 'thead', 'tbody', 'tr', 'th', 'td'], ALLOW_DATA_ATTR: false }) }}
              />
            </div>
          </section>
        ) : (
          /* Dynamic Content from About Settings */
          <>
            {/* ─── Our Story ─── */}
            {(pageData?.storyTitle || pageData?.storyContent) && (
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInUp}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="py-20 md:py-32"
              >
                <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                  <div>
                    {pageData.storyTitle && (
                      <h2 className="bound-regular text-3xl md:text-4xl lg:text-5xl text-zinc-600 mb-8 leading-[1.15]">
                        {pageData.storyTitle}
                      </h2>
                    )}
                    {pageData.storyContent && (
                      <div
                        className="space-y-6 text-zinc-600/50 leading-relaxed text-base md:text-lg"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pageData.storyContent, { ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a'], ALLOW_DATA_ATTR: false }) }}
                      />
                    )}
                  </div>
                  {pageData.storyImage && (
                    <div className="relative">
                      <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
                        <Image
                          src={pageData.storyImage}
                          alt="RaphArch Story"
                          fill
                          className="object-cover"
                          sizes="(min-width: 768px) 50vw, 100vw"
                          unoptimized
                        />
                      </div>
                      <span className="absolute -bottom-4 left-4 text-xs tracking-[0.25em] uppercase text-zinc-600/40 bg-white px-4 py-2">
                        Est. RaphArch
                      </span>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {/* ─── Pull Quote ─── */}
            {pageData?.pullQuote && (
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="py-16 md:py-24 border-t border-b border-black/10"
              >
                <blockquote className="max-w-4xl mx-auto text-center">
                  <span className="font-playfair italic text-2xl md:text-4xl lg:text-5xl text-zinc-600 leading-snug">
                    &ldquo;{pageData.pullQuote}&rdquo;
                  </span>
                </blockquote>
              </motion.section>
            )}

            {/* ─── Full-Width Video ─── */}
            {pageData?.videoUrl && (
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={fadeInUp}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="py-12 md:py-20"
              >
                <div className="relative w-full h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden bg-black">
                  <video
                    src={pageData.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  {pageData.videoOverlayText && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-playfair italic text-2xl md:text-4xl text-white tracking-wide drop-shadow-lg text-center px-6">
                        {pageData.videoOverlayText}
                      </span>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {/* ─── Banner Image ─── */}
            {pageData?.bannerImage && (
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={fadeInUp}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="py-12 md:py-20"
              >
                <div className="relative w-full h-[40vh] md:h-[55vh] lg:h-[65vh] overflow-hidden">
                  <Image
                    src={pageData.bannerImage}
                    alt="RaphArch"
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/10" />
                  {pageData.bannerText && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-playfair italic text-2xl md:text-4xl text-white tracking-wide drop-shadow-lg text-center px-6">
                        {pageData.bannerText}
                      </span>
                    </div>
                  )}
                </div>
              </motion.section>
            )}
          </>
        )}

        {/* ─── Visit Us ─── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeIn}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="py-20 md:py-28 border-t border-black/10"
        >
          <div className="grid md:grid-cols-5 gap-12 md:gap-16">
            {/* Left - Info */}
            <div className="md:col-span-3">
             
              <h2 className="bound-regular text-3xl md:text-4xl lg:text-5xl text-zinc-600 mb-8">
                Our Store
              </h2>

              {pageData?.storeDescription && (
                <p className="text-zinc-600 text-sm md:text-base leading-relaxed mb-8 max-w-md">
                  {pageData.storeDescription}
                </p>
              )}

              <div className="space-y-5">
                {fullAddress && (
                  <div className="flex items-start gap-4 group">
                    <span className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0 group-hover:bg-black/10 transition-all duration-300 group-hover:scale-110">
                      <MapPin className="w-4 h-4 text-zinc-600 group-hover:text-zinc-600 transition-colors duration-300" />
                    </span>
                    <div>
                      <span className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-0.5">Address</span>
                      <span className="text-zinc-600 text-sm">{fullAddress}</span>
                    </div>
                  </div>
                )}

                {pageData?.storePhone && (
                  <a href={`tel:${pageData.storePhone.replace(/\s/g, '')}`} className="flex items-start gap-4 group">
                    <span className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0 group-hover:bg-black/10 transition-all duration-300 group-hover:scale-110">
                      <Phone className="w-4 h-4 text-zinc-600 group-hover:text-zinc-600 transition-colors duration-300" />
                    </span>
                    <div>
                      <span className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-0.5">Phone</span>
                      <span className="text-zinc-600 text-sm group-hover:text-zinc-600 transition-colors">{pageData.storePhone}</span>
                    </div>
                  </a>
                )}

                {pageData?.storeEmail && (
                  <a href={`mailto:${pageData.storeEmail}`} className="flex items-start gap-4 group">
                    <span className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center shrink-0 group-hover:bg-black/10 transition-all duration-300 group-hover:scale-110">
                      <Mail className="w-4 h-4 text-zinc-600 group-hover:text-zinc-600 transition-colors duration-300" />
                    </span>
                    <div>
                      <span className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-0.5">Email</span>
                      <span className="text-zinc-600 text-sm group-hover:text-zinc-600/60 transition-colors">{pageData.storeEmail}</span>
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Right - CTA */}
            <div className="md:col-span-2 flex flex-col justify-center">
              <div className="bg-black/5 p-8 md:p-10 rounded-sm hover:bg-black/[0.07] transition-colors duration-300">
                <h3 className="bound-regular text-2xl text-zinc-600 mb-3">Get in Touch</h3>
                <p className="text-zinc-600 text-sm leading-relaxed mb-6">
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
        </motion.section>

      
       
      </div>
    </div>
  );
}
