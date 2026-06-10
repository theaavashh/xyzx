'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const COOKIE_NAME = 'hasSeenPromoPopup';

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const hasSeenPopup = Cookies.get(COOKIE_NAME);

    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    Cookies.set(COOKIE_NAME, '1', { expires: 30, sameSite: 'strict' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full relative overflow-hidden shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10 bg-white rounded-full p-1"
        >
          <X size={24} />
        </button>

        <div className="w-full h-64 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
            alt="Fashion model"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-1">
            UNLOCK YOUR
          </h2>
          <h3 className="text-center text-3xl font-bold text-gray-900 mb-6">
            15% OFF DISCOUNT
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-4 rounded-md font-semibold hover:bg-gray-800 transition-colors"
            >
              SUBSCRIBE &gt;
            </button>
          </form>

          <p className="text-xs text-center text-gray-600 mt-4">
            By entering your email address, you agree to receive promotional
            emails from Princess Polly. View our{' '}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{' '}
            &{' '}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms
            </a>
            .
          </p>

          <p className="text-xs text-center text-gray-500 mt-2">
            Discount excludes sales & gift cards.
          </p>
        </div>
      </div>
    </div>
  );
}