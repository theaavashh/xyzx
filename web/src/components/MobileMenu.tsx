'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight, HiPhone, HiMapPin } from 'react-icons/hi2';
import Link from 'next/link';
import type { NavItem } from './Navbar/types';
import { useBannerHeight } from '@/contexts/BannerHeightContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  activeSubmenu: string | null;
  setActiveSubmenu: (name: string | null) => void;
}

export default function MobileMenu({ isOpen, onClose, navItems, activeSubmenu, setActiveSubmenu }: MobileMenuProps) {
  const { bannerHeight } = useBannerHeight();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] touch-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed left-0 bottom-0 w-full sm:w-[85vw] sm:max-w-sm bg-white z-[61] flex flex-col overscroll-contain mt-16"
            style={{ top: bannerHeight || 0 }}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{
              duration: 0.35,
              ease: [0.32, 0, 0.67, 0],
            }}
          >
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <AnimatePresence mode="wait">
                {activeSubmenu ? (
                  <motion.div
                    key="submenu"
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveSubmenu(null)}
                      className="flex items-center gap-2 text-sm font-medium text-zinc-400 uppercase tracking-wider mb-5 hover:text-zinc-600 transition-colors"
                    >
                      <HiChevronLeft className="h-5 w-5" />
                      Back
                    </button>

                    <p className="text-xl font-semibold text-zinc-600 mb-5 uppercase tracking-wide">
                      {activeSubmenu}
                    </p>

                    <div className="space-y-6">
                      {navItems
                        .find((item) => item.name === activeSubmenu)
                        ?.columns.map((col) => (
                          <div key={col.title}>
                            <Link
                              href={col.href || '#'}
                              className="block text-lg font-medium text-zinc-600 uppercase tracking-widest mb-3 hover:text-zinc-600 transition-colors"
                              onClick={onClose}
                            >
                              {col.title}
                            </Link>
                            <div className="space-y-2.5">
                              {col.links.map((link) => (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  className="block text-xl text-zinc-600 hover:text-zinc-600 transition-colors"
                                  onClick={onClose}
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="main"
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div className="space-y-0.5">
                      {navItems.map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => item.columns.length > 0 ? setActiveSubmenu(item.name) : onClose()}
                          className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-zinc-50 transition-colors text-left"
                        >
                          <span className="text-xl font-medium text-zinc-800">{item.name}</span>
                          {item.columns.length > 0 && <HiChevronRight className="h-4 w-4 text-zinc-300" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!activeSubmenu && (
              <div className="border-t border-zinc-100 px-5 py-4 space-y-3">
                <Link
                  href="/contact-us"
                  className="flex items-center gap-3 px-3 py-2.5 text-base text-zinc-600 hover:text-zinc-600 rounded-lg hover:bg-zinc-50 transition-colors"
                  onClick={onClose}
                >
                  <HiPhone className="h-5 w-5" />
                  Contact Us
                </Link>
                <Link
                  href="/stores"
                  className="flex items-center gap-3 px-3 py-2.5 text-base text-zinc-600 hover:text-zinc-600 rounded-lg hover:bg-zinc-50 transition-colors"
                  onClick={onClose}
                >
                  <HiMapPin className="h-5 w-5" />
                  Find a Store
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
