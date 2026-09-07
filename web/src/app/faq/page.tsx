'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Minus, ArrowRight, MessageCircle } from 'lucide-react';
import { fetchFAQs } from '@/components/FAQ/utils/api';
import type { FAQItem } from '@/components/FAQ/types';

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-zinc-200 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="text-sm md:text-base lg:text-lg font-medium text-zinc-900 group-hover:text-zinc-600 transition-colors pr-4">
          {q}
        </span>
        {open ? (
          <Minus className="w-4 h-4 text-zinc-400 shrink-0" />
        ) : (
          <Plus className="w-4 h-4 text-zinc-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="pb-5">
          <p className="text-sm md:text-base lg:text-lg text-zinc-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

function groupFAQs(faqs: FAQItem[]): { category: string; questions: FAQItem[] }[] {
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
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    async function load() {
      const data = await fetchFAQs();
      setFaqs(data);
      setLoading(false);
    }
    load();
  }, []);

  const categories = useMemo(() => groupFAQs(faqs), [faqs]);

  useEffect(() => {
    if (!activeCategory && categories.length > 0) {
      setActiveCategory(categories[0].category);
    }
  }, [categories, activeCategory]);

  const activeQuestions = useMemo(() => {
    const cat = categories.find((c) => c.category === activeCategory);
    return cat?.questions ?? [];
  }, [categories, activeCategory]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="text-left lg:text-center mb-6 mt-6 md:mt-10 lg:mt-12">
          <h1 className="bound-regular text-2xl sm:text-3xl md:text-4xl text-zinc-900">
            FAQS
          </h1>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-zinc-100 rounded" />
            ))}
          </div>
        ) : (
          <>
            <div className="hidden lg:flex items-center gap-6 sm:gap-8 overflow-x-auto pb-4 mb-8 border-b border-zinc-200 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setActiveCategory(cat.category)}
                  className={`shrink-0 swansea text-sm md:text-base lg:text-lg transition-colors pb-4 -mb-4 border-b-2 ${
                    activeCategory === cat.category
                      ? 'text-zinc-900 border-zinc-900'
                      : 'text-zinc-400 border-transparent hover:text-zinc-600'
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            <div className="lg:hidden space-y-10">
              {categories.map((cat) => (
                <div key={cat.category}>
                  <h2 className="swansea text-lg text-zinc-900 mb-3">{cat.category}</h2>
                  <div className="divide-y divide-zinc-200">
                    {cat.questions.map((faq) => (
                      <Accordion key={faq.id} q={faq.question} a={faq.answer} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden lg:block divide-y divide-zinc-200">
              {activeQuestions.map((faq) => (
                <Accordion key={faq.id} q={faq.question} a={faq.answer} />
              ))}
            </div>

            <div className="mt-24 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 md:p-10 text-center">
              <MessageCircle className="w-10 h-10 mx-auto mb-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white mb-2">Still Have Questions?</h2>
              <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
                Can&apos;t find what you&apos;re looking for? Our support team is here to help.
              </p>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-amber-300 transition-all text-sm"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
