'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContextTanStack';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const { login, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'all',
  });

  const onSubmit = async (data: LoginForm) => {
    setApiError('');
    const success = await login(data.email, data.password);
    if (success) {
      router.push('/dashboard');
    } else {
      setApiError('Invalid email or password. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
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
          <div className="flex flex-col items-center gap-3 mb-8 tracking-tight">
            <div className="text-center">
              <h1 className="lastik text-4xl text-black">Welcome</h1>
              <p className="text-base text-black mt-1">Sign in to your account</p>
            </div>
          </div>

          {apiError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 text-center">
              {apiError}
            </motion.div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors active:scale-[0.98] mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-base font-medium text-black">Continue with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-sm uppercase tracking-wider text-black"><span className="bg-white px-3">or sign in with email</span></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-base font-medium text-black">Email</label>
              <input id="email" type="email" {...register('email')} className={`w-full px-4 py-3 border ${errors.email ? 'border-red-400' : 'border-gray-300'} rounded-lg text-base text-gray-900 outline-none focus:border-black transition-colors placeholder:text-gray-400`} placeholder="name@example.com" />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-base font-medium text-black">Password</label>
                <Link href="/auth/forgot-password" className="text-base text-black hover:text-gray-600 transition-colors">Forgot Password</Link>
              </div>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} {...register('password')} className={`w-full px-4 pr-10 py-3 border ${errors.password ? 'border-red-400' : 'border-gray-300'} rounded-lg text-base text-gray-900 outline-none focus:border-black transition-colors placeholder:text-gray-400`} placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isAuthLoading} className="w-full py-3 bg-black text-white text-base font-semibold rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isAuthLoading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
              ) : (
                <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-base text-black">Don't have an account? </span>
            <Link href="/signup" className="text-base font-semibold text-black hover:underline">Sign Up</Link>
          </div>

          <p className="mt-8 text-center text-sm text-black">
            <Link href="/privacy" className="text-black hover:text-gray-600 transition-colors">Privacy</Link>
            <span className="mx-2">&bull;</span>
            <Link href="/terms" className="text-gray-500 hover:text-black transition-colors">Terms</Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
