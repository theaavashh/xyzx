'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

export function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="mb-12 text-center">
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-3 lastik">
        Subscribe to get 10% off your first purchase.
      </h3>
      <p className="text-base text-black mb-6 max-w-md mx-auto">
        Be the first to know about new arrivals, exclusive offers, and more.
      </p>
      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail className="w-4 h-4 text-black absolute left-0 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full pl-7 pr-4 py-3 text-base border-0 border-b border-black focus:outline-none focus:ring-0 focus:border-black text-black bg-transparent rounded-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-3 bg-transparent text-black text-base font-medium hover:opacity-60 transition-opacity shrink-0"
          >
            Subscribe
          </button>
        </form>
      ) : (
        <p className="text-base text-black">Thanks for subscribing!</p>
      )}
      <p className="text-sm text-black mt-4">
        This site is protected and you agree to our{' '}
        <a href="/privacy" className="underline hover:opacity-60 text-black">Privacy Policy</a>.
      </p>
    </div>
  );
}
