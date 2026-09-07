'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContextTanStack';

const emailSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

const passwordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

type EmailForm = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const { login, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
    mode: 'all',
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
    mode: 'all',
  });

  const handleEmailSubmit = (data: EmailForm) => {
    setApiError('');
    setEmail(data.email);
    setStep('password');
  };

  const handlePasswordSubmit = async (data: PasswordForm) => {
    setApiError('');
    const success = await login(email, data.password);
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
      <main className="flex-1 flex items-center justify-center  px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-sm"
        >
          <div className="flex flex-col items-center gap-3 mb-8 tracking-wide">
            <div className="text-center">
              <h1 className="text-2xl sm:text-4xl text-zinc-900 font-extrabold swansea ">Welcome to Rapharch</h1>
              <p className="text-lg text-zinc-600 text-zinc-600 mt-1">Sign in to your account</p>
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
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-100 transition-colors active:scale-[0.98] mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-base font-medium text-zinc-600">Continue with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-sm uppercase tracking-wider text-zinc-600"><span className="px-3">OR</span></div>
          </div>

          <AnimatePresence mode="wait">
            {step === 'email' ? (
              <motion.form
                key="email-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                noValidate
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-base font-medium text-zinc-600">Email</label>
                  <input
                    id="email"
                    type="email"
                    {...emailForm.register('email')}
                    className={`w-full px-4 py-3 border ${emailForm.formState.errors.email ? 'border-red-400' : 'border-gray-300'} rounded-lg text-base text-zinc-600 outline-none focus:border-black transition-colors placeholder:text-zinc-600`}
                    placeholder="name@example.com"
                    autoFocus
                  />
                  {emailForm.formState.errors.email && <p className="text-sm text-red-500">{emailForm.formState.errors.email.message}</p>}
                </div>

                <button type="submit" className="w-full py-3 bg-black text-white text-base font-semibold rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                  <span>Continue with email</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="password-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                noValidate
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-base font-medium text-zinc-600">Password</label>
                    <Link href="/auth/forgot-password" className="text-base text-zinc-600 hover:text-zinc-600 transition-colors">Forgot Password</Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...passwordForm.register('password')}
                      className={`w-full px-4 pr-10 py-3 border ${passwordForm.formState.errors.password ? 'border-red-400' : 'border-gray-300'} rounded-lg text-base text-zinc-600 outline-none focus:border-black transition-colors placeholder:text-zinc-600`}
                      placeholder="Enter your password"
                      autoFocus
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-600 transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordForm.formState.errors.password && <p className="text-sm text-red-500">{passwordForm.formState.errors.password.message}</p>}
                </div>

                <button type="submit" disabled={isAuthLoading} className="w-full py-3 bg-black text-white text-base font-semibold rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isAuthLoading ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  ) : (
                    <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setApiError('');
                    passwordForm.reset();
                  }}
                  className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-600 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center">
            <span className="text-base text-zinc-600">Don't have an account? </span>
            <Link href="/signup" className="text-base font-semibold text-zinc-600 hover:underline">Sign Up</Link>
          </div>

          <p className="mt-4 text-center text-[11px] text-zinc-600 leading-relaxed">
            By clicking &quot;Sign in with Google&quot; or &quot;Continue with email&quot; you agree to our{' '}
            <Link href="/terms" className="text-zinc-600 hover:text-zinc-600 transition-colors underline">Terms of Use</Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-zinc-600 hover:text-zinc-600 transition-colors underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
