'use client';

import { useState, useEffect } from 'react';

export default function OfflineCouponBanner() {
  const [hidden, setHidden] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('OFFLINE10');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = 'OFFLINE10';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-100 bg-white/90 backdrop-blur-md px-6 py-4 transition-all duration-300 md:hidden ${
        hidden ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <div className="flex flex-col items-center gap-3">
          <span className="text-lg font-medium text-black">Offer at checkout</span>
          <span className="rounded-full bg-neutral-100 px-4 py-1.5 font-mono text-sm tracking-wider text-black">
            Apply OFFLINE10
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="rounded-full bg-amber-400 px-8 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-300"
        >
          {copied ? 'Copied' : 'Copy code'}
        </button>
      </div>
    </div>
  );
}
