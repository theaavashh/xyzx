'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { Cookie, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CookieConsentModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('cookie_consent');
    if (!consent) {
      // Delay showing the modal for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const consentData = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: new Date().toISOString(),
    };

    Cookies.set('cookie_consent', JSON.stringify(consentData), {
      expires: 365,
    });
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const consentData = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      timestamp: new Date().toISOString(),
    };

    Cookies.set('cookie_consent', JSON.stringify(consentData), {
      expires: 365,
    });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-[100]"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] relative">
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="absolute top-3 right-3 text-zinc-600 hover:text-zinc-900 transition-colors p-1 z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="bg-amber-50 rounded-xl p-2.5 flex-shrink-0">
                    <Cookie className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="swansea text-lg font-bold text-zinc-600 tracking-wide">
                      Cookie Settings
                    </h2>
                    <p className="text-zinc-600 text-base leading-relaxed">
                      We use cookies to optimize your experience, analyze traffic, and personalize content. By clicking <span className="font-medium text-zinc-600">&ldquo;Accept All&rdquo;</span>, you consent. See our{' '}
                      <Link href="/cookie-policy" className="text-[#D4AF37] hover:underline underline-offset-4 font-medium">
                        Cookie Policy
                      </Link>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleRejectAll}
                    className="bg-white text-zinc-600 py-2.5 px-5 rounded-lg font-semibold hover:bg-gray-50 border border-gray-200 transition-all active:scale-[0.98] text-sm whitespace-nowrap"
                  >
                    Manage Choices
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="bg-[#D4AF37] text-white py-2.5 px-5 rounded-lg font-semibold hover:bg-[#c4a030] transition-all active:scale-[0.98] text-sm whitespace-nowrap"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
