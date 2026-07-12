'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, MapPin, ArrowRight, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { fetchVisitOurStore } from '@/components/VisitOurStore/utils/api';
import type { VisitOurStoreData } from '@/components/VisitOurStore/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

export default function ContactPage() {
  const [store, setStore] = useState<VisitOurStoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const result = await fetchVisitOurStore();
        if (mounted) setStore(result);
      } catch {
        if (mounted) setStore(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(`${API_BASE}/api/v1/contact/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          subject: formData.get('subject'),
          message: formData.get('message'),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        form.reset();
      } else {
        const err = await response.json().catch(() => null);
        setError(err?.message || 'Failed to send message. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
      </div>
    );
  }

  const data = store?.isActive ? store : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

        {submitted ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl border border-black/10 p-8 md:p-12 text-center max-w-lg mx-auto"
          >
            <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-black" />
            </div>
            <h3 className="lastik text-2xl text-black mb-2">
              Message Sent!
            </h3>
            <p className="text-sm text-black mb-6 max-w-sm mx-auto">
              Thank you for reaching out. Our team will get back to you within 48 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-5 py-2.5 text-sm font-medium text-black bg-black/5 rounded-lg hover:bg-black/10 transition-colors"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="lastik text-3xl sm:text-4xl md:text-5xl text-black mb-6 leading-tight">
                GET IN TOUCH<br />WITH US
              </h1>
              <div className="flex flex-col gap-3 text-base mb-8">
                <a
                  href={`mailto:${data?.email || 'support@rapharch.com'}`}
                  className="flex items-center gap-3 text-black transition-colors group"
                >
                  <span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 group-hover:scale-110 transition-all duration-300">
                    <Mail className="w-3.5 h-3.5 text-black transition-colors duration-300" />
                  </span>
                  {data?.email || 'support@rapharch.com'}
                </a>
                <a
                  href={`tel:${data?.phone || '+1 (212) 555-0189'}`}
                  className="flex items-center gap-3 text-black transition-colors group"
                >
                  <span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 group-hover:scale-110 transition-all duration-300">
                    <Phone className="w-3.5 h-3.5 text-black transition-colors duration-300" />
                  </span>
                  {data?.phone || '+1 (212) 555-0189'}
                </a>
              </div>
              <hr className="border-black/10" />
            </motion.div>

            <div>
              <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name *"
                    className="w-full px-4 py-3 text-sm text-black border border-black/10 rounded-md focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black bg-white/50 placeholder:text-black"
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email *"
                    className="w-full px-4 py-3 text-sm text-black border border-black/10 rounded-md focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black bg-white/50 placeholder:text-black"
                    required
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Phone Number *"
                    className="w-full px-4 py-3 text-sm text-black border border-black/10 rounded-md focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black bg-white/50 placeholder:text-black"
                    required
                  />
                </div>

                <div>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 text-sm text-black border border-black/10 rounded-md focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black bg-white/50"
                  >
                    <option value="" disabled selected>Subject</option>
                    <option value="order">Order Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="shipping">Shipping Information</option>
                    <option value="return">Return & Exchange</option>
                    <option value="technical">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Message *"
                    className="w-full px-4 py-3 text-sm text-black border border-black/10 rounded-md focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black bg-white/50 placeholder:text-black resize-none"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50/50 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-black/80 transition-all duration-300 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
