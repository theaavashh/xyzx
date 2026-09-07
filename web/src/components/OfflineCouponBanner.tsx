'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiXMark } from 'react-icons/hi2';
import { fetchActiveCoupons } from './OfflineCouponBanner/utils/api';

export default function OfflineCouponBanner() {
  const [hidden, setHidden] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: coupons } = useQuery({
    queryKey: ['coupons', 'active'],
    queryFn: fetchActiveCoupons,
    staleTime: 5 * 60 * 1000,
  });

  const coupon = coupons && coupons.length > 0 ? coupons[0] : null;

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCopy = async () => {
    if (!coupon) return;
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = coupon.code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (dismissed || !coupon) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-gray-50 px-5 py-6 transition-all duration-300 md:hidden ${
        hidden ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-zinc-600/40 hover:text-zinc-600 transition-colors"
        aria-label="Close"
      >
        <HiXMark className="w-4 h-4" />
      </button>
      <div className="mx-auto flex max-w-9xl items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-zinc-600 uppercase tracking-wide">
            Offer at checkout
          </p>
          <p className="text-sm text-zinc-600 mt-0.5 font-medium">
            Use code <span className="px-2 py-0.5 rounded text-zinc-600 font-semibold text-sm tracking-widest">{coupon.code}</span> for an exclusive discount
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="bg-black text-white px-4 py-1.5 rounded-md text-xs font-semibold transition-all hover:bg-zinc-800 active:scale-95 whitespace-nowrap flex-shrink-0"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
