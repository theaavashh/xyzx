'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRequestPasswordReset } from '@/lib/dashboard/hooks';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const requestReset = useRequestPasswordReset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    requestReset.mutate(email, {
      onSuccess: () => setEmail(''),
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-sm"
        >
          <div className="flex flex-col items-center gap-6 mb-8">
            <Link href="/" className="transition-opacity hover:opacity-70">
              <Image src="/raphard-logo.png" alt="Rapharch" width={140} height={140} className="h-12 w-auto object-contain" priority />
            </Link>
            <div className="text-center">
              <h2 className="swansea text-4xl text-zinc-600">Reset Password</h2>
              <p className="text-base text-zinc-600 mt-1.5">
                Enter your email to receive a reset link.
              </p>
            </div>
          </div>

          {requestReset.isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700 text-center"
            >
              If an account exists for {email}, you will receive a reset link shortly.
            </motion.div>
          )}

          {requestReset.isError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 text-center"
            >
              An error occurred. Please try again.
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="forgot-email" className="block text-base font-medium text-zinc-600">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-base text-zinc-600 outline-none focus:border-black transition-colors placeholder:text-zinc-600"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={requestReset.isPending}
              className="w-full py-3 bg-black text-white text-base font-semibold rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {requestReset.isPending ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
