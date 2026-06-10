'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { Cookie, X, ShieldCheck } from 'lucide-react';
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
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[420px] z-[100]"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 rounded-3xl relative overflow-hidden">
            {/* Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F5E6AD]" />

            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors p-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="bg-amber-50 rounded-2xl p-3 flex-shrink-0">
                  <Cookie className="w-7 h-7 text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <div className="pt-1">
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                    Cookie Settings
                  </h2>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                    We use cookies to optimize your experience, analyze traffic, and personalize content. 
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600 text-[13px] leading-relaxed">
                  By clicking <span className="font-medium text-gray-900">"Accept All"</span>, you consent to our use of cookies as described in our{' '}
                  <Link href="/cookie-policy" className="text-[#D4AF37] hover:underline underline-offset-4 font-medium">
                    Cookie Policy
                  </Link>.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="flex-1 bg-[#D4AF37] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#c4a030] transition-all active:scale-[0.98] text-sm"
                  >
                    Accept All
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectAll}
                    className="flex-1 bg-white text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 border border-gray-200 transition-all active:scale-[0.98] text-sm"
                  >
                    Manage Choices
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-2 pt-1">
                  <ShieldCheck className="w-4 h-4 text-gray-400" />
                  <span className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">
                    Secure & Private
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
