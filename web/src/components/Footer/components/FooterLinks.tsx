'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { memo, useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { fetchCategories } from '@/components/ShopByCategory/utils/api';
import type { FooterSectionData } from '../types';

interface FooterLinksProps {
  sections: FooterSectionData[];
}

const DEFAULT_SECTIONS: FooterSectionData[] = [
  {
    id: 'default-about',
    title: 'About',
    order: 2,
    isActive: true,
    links: [
      { id: 'about-company', name: 'Our Company', href: '/about', order: 1 },
      { id: 'about-stores', name: 'Find a Store', href: '/stores', order: 2 },
      { id: 'about-contact', name: 'Contact Us', href: '/contact-us', order: 3 },
    ],
  },
  {
    id: 'default-policies',
    title: 'Policies',
    order: 3,
    isActive: true,
    links: [
      { id: 'policy-privacy', name: 'Privacy Policy', href: '/privacy', order: 1 },
      { id: 'policy-terms', name: 'Terms of Service', href: '/terms', order: 2 },
      { id: 'policy-shipping', name: 'Shipping & Returns', href: '/shipping', order: 3 },
      { id: 'policy-return', name: 'Return Policy', href: '/return-policy', order: 4 },
      { id: 'policy-faq', name: 'FAQ', href: '/faq', order: 5 },
    ],
  },
];

export const FooterLinks = memo(function FooterLinks({ sections }: FooterLinksProps) {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; href: string }[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const data = await fetchCategories();
      if (data.length > 0) {
        setCategories(
          data.map((cat) => ({
            id: `cat-${cat.id}`,
            name: cat.title,
            href: cat.link || `/category/${cat.title.toLowerCase().replace(/\s+/g, '-')}`,
          }))
        );
      }
    }
    loadCategories();
  }, []);

  const hasSections = sections.length > 0;
  const categoryLinks = categories.length > 0
    ? categories.map((c) => ({ id: c.id, name: c.name, href: c.href, order: 0 }))
    : [];

  const categorySection: FooterSectionData | null = categoryLinks.length > 0
    ? { id: 'default-category', title: 'Category', order: 1, isActive: true, links: categoryLinks }
    : null;

  const staticSections = hasSections ? sections : DEFAULT_SECTIONS;
  const displaySections = categorySection ? [categorySection, ...staticSections] : staticSections;

  function toggleSection(id: string) {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
      {displaySections.map((section, index) => {
        const sectionId = section.id ?? `section-${index}`;
        const isOpen = openSections.includes(sectionId);

        return (
          <div key={sectionId} className="border-b border-gray-300 md:border-b-0 pb-3 md:pb-0">
            <button
              onClick={() => toggleSection(sectionId)}
              className="flex items-center justify-between w-full text-left md:cursor-default py-2 md:py-0"
            >
              <h4 className="swansea text-base lg:text-lg font-extrabold text-zinc-900 tracking-wider uppercase">
                {section.title}
              </h4>
              {isOpen ? (
                <Minus className="w-5 h-5 text-zinc-600 md:hidden" />
              ) : (
                <Plus className="w-5 h-5 text-zinc-600 md:hidden" />
              )}
            </button>
            <div className="hidden md:block">
              <ul className="space-y-2 lg:space-y-3 mt-3" role="list">
                {section.links.map((link, linkIndex) => (
                  <li key={link.id ?? `link-${index}-${linkIndex}`}>
                    <Link
                      href={link.href}
                      className="text-base lg:text-xl text-zinc-600 hover:opacity-60 transition-opacity"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:hidden">
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="space-y-2 overflow-hidden pt-3"
                    role="list"
                  >
                    {section.links.map((link, linkIndex) => (
                      <li key={link.id ?? `link-${index}-${linkIndex}`}>
                        <Link
                          href={link.href}
                          className="text-base lg:text-xl text-zinc-600 hover:opacity-60 transition-opacity"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
});
