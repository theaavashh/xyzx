'use client';

import { useEffect, useState, useRef } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
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
    return () => { mounted = false; };
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
        <div className="w-4 h-4 border border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
      </div>
    );
  }

  const data = store?.isActive ? store : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="mb-12">
          <span className="text-md font-medium text-zinc-400 uppercase">Get in Touch</span>
          <h1 className={`text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight mt-2 mb-3 lastik`}>Contact Us</h1>
          <p className="text-sm text-zinc-500">Have a question or need assistance? We are here to help.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {data && (
          <div className="lg:col-span-2 space-y-6">
            {data.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">Phone</p>
                  <a href={`tel:${data.phone}`} className="text-sm text-zinc-900 hover:underline">{data.phone}</a>
                </div>
              </div>
            )}
            {data.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">Email</p>
                  <a href={`mailto:${data.email}`} className="text-sm text-zinc-900 hover:underline">{data.email}</a>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">Address</p>
                <p className="text-sm text-zinc-900">{data.address}</p>
                <p className="text-xs text-zinc-500">{data.city}, {data.state} {data.zip}</p>
              </div>
            </div>
            {data.hours && data.hours.length > 0 && (
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">Business Hours</p>
                  <div className="space-y-1">
                    {data.hours.map((h, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <span className="text-zinc-500">{h.days}</span>
                        <span className="text-zinc-900 font-medium">{h.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          )}

          <div className={data ? "lg:col-span-3" : "lg:col-span-5"}>
            {submitted ? (
              <div className="bg-green-50 rounded-xl border border-green-200 p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent!</h3>
                <p className="text-green-600 text-sm mb-4">Thank you for reaching out. We will get back to you shortly.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 bg-white"
                  >
                    <option value="">Select a topic</option>
                    <option value="order">Order Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="shipping">Shipping Information</option>
                    <option value="return">Return & Exchange</option>
                    <option value="technical">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 resize-none"
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
