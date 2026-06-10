'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { fetchFAQs } from '@/components/FAQ/utils/api';
import type { FAQItem, FAQCategory } from '@/components/FAQ/types';

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 pr-4">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-gray-500 leading-relaxed text-sm">{a}</p>
        </div>
      )}
    </div>
  );
}

function groupFAQs(faqs: FAQItem[]): FAQCategory[] {
  const map = new Map<string, FAQItem[]>();
  for (const faq of faqs) {
    const list = map.get(faq.category) ?? [];
    list.push(faq);
    map.set(faq.category, list);
  }
  return Array.from(map.entries()).map(([category, questions]) => ({ category, questions }));
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchFAQs();
      setFaqs(data);
      setLoading(false);
    }
    load();
  }, []);

  const categories = groupFAQs(faqs);

  return (
    <div className="min-h-screen bg-white">
      <section className="py-24 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 ring-1 ring-amber-400/20 mb-6">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600">
                Help Center
              </span>
            </div>
            <h1 className={`lastik text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6`}>
              FAQ
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-base lg:text-lg leading-relaxed">
              Find answers to common questions about orders, shipping, returns, and more
            </p>
          </div>

          {loading ? (
            <div className="space-y-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-8 w-40 bg-gray-200 rounded mb-4" />
                  <div className="space-y-3">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-16 bg-gray-100 rounded-2xl" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="text-center text-gray-500">No FAQs available yet.</p>
          ) : (
            <div className="space-y-12">
              {categories.map((cat) => (
                <div key={cat.category}>
                  <h2 className={`lastik text-2xl text-gray-900 mb-4`}>
                    {cat.category}
                  </h2>
                  <div className="space-y-3">
                    {cat.questions.map((faq) => (
                      <Accordion key={faq.id} q={faq.question} a={faq.answer} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-20 bg-gray-50 rounded-3xl p-8 md:p-12 text-center">
            <HelpCircle className="w-10 h-10 mx-auto mb-6 text-amber-500" />
            <h2 className={`lastik text-2xl text-gray-900 mb-4`}>
              Still Have Questions?
            </h2>
            <p className="text-gray-500 mb-6 max-w-xl mx-auto">
              Can&apos;t find what you&apos;re looking for? Our customer service team is here to help.
            </p>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-black font-bold rounded-xl hover:bg-amber-300 transition-colors text-sm"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
