'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContextTanStack';

type AuthTab = 'signin' | 'signup';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    marketingEmails: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const { login, signup, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    reset: resetLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'all',
  });

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    reset: resetSignup,
    formState: { errors: signupErrors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      marketingEmails: false,
    },
    mode: 'all',
  });

  const onLoginSubmit = async (data: LoginForm) => {
    setApiError('');
    const success = await login(data.email, data.password);
    if (success) {
      router.push('/dashboard');
    } else {
      setApiError('Invalid email or password. Please try again.');
    }
  };

  const onSignupSubmit = async (data: SignupForm) => {
    setApiError('');
    const success = await signup(
      `${data.firstName} ${data.lastName}`.trim(),
      data.email,
      data.password,
    );
    if (success) {
      router.push('/dashboard');
    } else {
      setApiError('Failed to create account. Please try again.');
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
          <div className="flex flex-col items-center gap-6 mb-8">
            <Link href="/" className="transition-opacity hover:opacity-70">
              <Image src="/raphard-logo.png" alt="Rapharch" width={140} height={140} className="h-12 w-auto object-contain" priority />
            </Link>
            <div className="text-center">
              <h2 className="lastik text-4xl text-neutral-900">
                {activeTab === 'signin' ? 'Welcome' : 'Join Us'}
              </h2>
              <p className="text-lg text-gray-700 mt-1.5">
                {activeTab === 'signin'
                  ? 'Sign in to your account'
                  : 'Create your account'}
              </p>
            </div>
          </div>

          <div className="flex p-1 mb-6 bg-gray-100 rounded-md relative">
            <motion.div
              className="absolute inset-y-1 bg-white rounded-md shadow-sm z-0"
              initial={false}
              animate={{
                left: activeTab === 'signin' ? '0.25rem' : '50%',
                right: activeTab === 'signin' ? '50%' : '0.25rem',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => { setActiveTab('signin'); setApiError(''); resetLogin(); }}
              className={`flex-1 py-2.5 text-md font-bold rounded-md relative z-10 transition-colors ${activeTab === 'signin' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setApiError(''); resetSignup(); }}
              className={`flex-1 py-2.5 text-md font-bold rounded-md relative z-10 transition-colors ${activeTab === 'signup' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              Sign Up
            </button>
          </div>

          {apiError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 text-center">
              {apiError}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'signin' ? (
              <motion.div key="signin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <form onSubmit={handleLoginSubmit(onLoginSubmit)} noValidate className="space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-md font-semibold text-gray-700">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300" />
                      <input id="email" type="email" {...registerLogin('email')} className={`w-full pl-10 pr-4 py-3 border-2 ${loginErrors.email ? 'border-red-400' : 'border-[#D4AF37]'} rounded-lg text-md text-gray-900 outline-none focus:border-[#D4AF37] transition-colors placeholder:text-gray-700`} placeholder="name@example.com" />
                    </div>
                    {loginErrors.email && <p className="text-xs text-red-500">{loginErrors.email.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="text-md font-semibold text-gray-700">Password</label>
                      <Link href="/auth/forgot-password" className="text-md text-[#D4A737] hover:text-neutral-900 transition-colors">Forgot Password</Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-300" />
                      <input id="password" type={showPassword ? 'text' : 'password'} {...registerLogin('password')} className={`w-full pl-10 pr-10 py-3 border-2 ${loginErrors.password ? 'border-red-400' : 'border-[#D4AF37]'} rounded-lg text-md text-gray-900 outline-none focus:border-[#D4AF37] transition-colors placeholder:text-gray-700`} placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-600 transition-colors">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {loginErrors.password && <p className="text-xs text-red-500">{loginErrors.password.message}</p>}
                  </div>

                  <button type="submit" disabled={isAuthLoading} className="w-full py-3 bg-amber-400 text-neutral-900 text-md font-semibold uppercase tracking-wider rounded-full hover:bg-amber-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {isAuthLoading ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    ) : (
                      <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="signup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <form onSubmit={handleSignupSubmit(onSignupSubmit)} noValidate className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-md font-semibold text-gray-700">First Name</label>
                      <input {...registerSignup('firstName')} className={`w-full px-4 py-3 border-2 ${signupErrors.firstName ? 'border-red-400' : 'border-[#D4AF37]'} rounded-lg text-md text-gray-900 outline-none focus:border-[#D4AF37] transition-colors placeholder:text-gray-700`} placeholder="John" />
                      {signupErrors.firstName && <p className="text-xs text-red-500">{signupErrors.firstName.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-md font-semibold text-gray-700">Last Name</label>
                      <input {...registerSignup('lastName')} className={`w-full px-4 py-3 border-2 ${signupErrors.lastName ? 'border-red-400' : 'border-[#D4AF37]'} rounded-lg text-md text-gray-900 outline-none focus:border-[#D4AF37] transition-colors placeholder:text-gray-700`} placeholder="Doe" />
                      {signupErrors.lastName && <p className="text-xs text-red-500">{signupErrors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-md font-semibold text-gray-700">Email</label>
                    <input {...registerSignup('email')} className={`w-full px-4 py-3 border-2 ${signupErrors.email ? 'border-red-400' : 'border-[#D4AF37]'} rounded-lg text-md text-gray-900 outline-none focus:border-[#D4AF37] transition-colors placeholder:text-gray-700`} placeholder="name@example.com" />
                    {signupErrors.email && <p className="text-xs text-red-500">{signupErrors.email.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-md font-semibold text-gray-700">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} {...registerSignup('password')} className={`w-full px-4 pr-10 py-3 border-2 ${signupErrors.password ? 'border-red-400' : 'border-[#D4AF37]'} rounded-lg text-md text-gray-900 outline-none focus:border-[#D4AF37] transition-colors placeholder:text-gray-700`} placeholder="At least 8 characters" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-600">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {signupErrors.password && <p className="text-xs text-red-500">{signupErrors.password.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-md font-semibold text-gray-700">Confirm Password</label>
                    <div className="relative">
                      <input type={showConfirmPassword ? 'text' : 'password'} {...registerSignup('confirmPassword')} className={`w-full px-4 pr-10 py-3 border-2 ${signupErrors.confirmPassword ? 'border-red-400' : 'border-[#D4AF37]'} rounded-lg text-md text-gray-900 outline-none focus:border-[#D4AF37] transition-colors placeholder:text-gray-700`} placeholder="••••••••" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-600">
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {signupErrors.confirmPassword && <p className="text-xs text-red-500">{signupErrors.confirmPassword.message}</p>}
                  </div>

                  <div className="flex items-start gap-3 py-1">
                    <input id="marketing" type="checkbox" {...registerSignup('marketingEmails')} className="mt-0.5 h-4 w-4 rounded border-[#D4AF37] text-neutral-900 focus:ring-[#D4AF37] cursor-pointer" />
                    <label htmlFor="marketing" className="text-xs text-neutral-400 cursor-pointer select-none">
                      Join our newsletter for exclusive restocks and new arrivals.
                    </label>
                  </div>

                  <button type="submit" disabled={isAuthLoading} className="w-full py-3 bg-amber-400 text-neutral-900 text-md font-semibold uppercase tracking-wider rounded-full hover:bg-amber-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {isAuthLoading ? (
                      <svg className="animate-spin h-4 w-4 mx-auto" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    ) : 'Create Account'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-100" /></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider text-neutral-300"><span className="bg-white px-3">Or continue with</span></div>
            </div>

            <button type="button" onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 px-4 py-3 mt-6 border border-neutral-200 rounded-full hover:bg-neutral-50 transition-colors active:scale-[0.98]">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-sm font-medium text-neutral-600">Google</span>
            </button>
          </div>

          <p className="mt-8 text-center text-[10px] text-neutral-300 uppercase tracking-wider">
            <Link href="/privacy" className="text-neutral-500 hover:text-neutral-900 transition-colors">Privacy</Link>
            <span className="mx-2">&bull;</span>
            <Link href="/terms" className="text-neutral-500 hover:text-neutral-900 transition-colors">Terms</Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
