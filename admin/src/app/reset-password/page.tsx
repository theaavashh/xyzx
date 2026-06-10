'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { LogoHeader } from '@/features/login';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9999';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenFromUrl);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token.trim()) {
      toast.error('Reset token is required');
      return;
    }

    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/reset-password`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token, newPassword }),
        },
      );

      const result = await response.json();

      if (result.success) {
        toast.success('Password reset successful!');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        throw new Error(result.message || 'Password reset failed');
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Password reset failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border">
        <LogoHeader />

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Reset Your Password
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your email and new password
            </p>
          </div>

          <div>
            <label
              htmlFor="reset-token"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Reset Token
            </label>
            <input
              id="reset-token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
              placeholder="Paste your reset token"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="reset-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="reset-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              id="reset-password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
              placeholder="Enter new password"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="reset-confirm-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="reset-confirm-password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
              placeholder="Confirm new password"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="show-password"
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="show-password" className="text-sm text-gray-600">
              Show password
            </label>
          </div>

          <button
            type="submit"
            disabled={
              isLoading ||
              !token.trim() ||
              !email.trim() ||
              !newPassword ||
              newPassword !== confirmPassword
            }
            className="w-full bg-amber-600 text-white py-2.5 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-sm text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              Back to login
            </button>
          </div>
        </form>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-100 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
