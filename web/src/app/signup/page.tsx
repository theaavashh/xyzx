'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContextTanStack';

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

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const { signup, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
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

  const onSubmit = async (data: SignupForm) => {
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
              <h1 className="lastik text-4xl text-black">Join Us</h1>
              <p className="text-base text-black mt-1">Create your account</p>
            </div>
          </div>

          {apiError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-5 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 text-center">
              {apiError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-base font-medium text-black">First Name</label>
                <input {...register('firstName')} className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-400' : 'border-gray-300'} rounded-lg text-base text-gray-900 outline-none focus:border-black transition-colors placeholder:text-gray-400`} placeholder="John" />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-base font-medium text-black">Last Name</label>
                <input {...register('lastName')} className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-400' : 'border-gray-300'} rounded-lg text-base text-gray-900 outline-none focus:border-black transition-colors placeholder:text-gray-400`} placeholder="Doe" />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-base font-medium text-black">Email</label>
              <input {...register('email')} className={`w-full px-4 py-3 border ${errors.email ? 'border-red-400' : 'border-gray-300'} rounded-lg text-base text-gray-900 outline-none focus:border-black transition-colors placeholder:text-gray-400`} placeholder="name@example.com" />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-base font-medium text-black">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} {...register('password')} className={`w-full px-4 pr-10 py-3 border ${errors.password ? 'border-red-400' : 'border-gray-300'} rounded-lg text-base text-gray-900 outline-none focus:border-black transition-colors placeholder:text-gray-400`} placeholder="At least 8 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-base font-medium text-black">Confirm Password</label>
              <input {...register('confirmPassword')} className={`w-full px-4 pr-10 py-3 border ${errors.confirmPassword ? 'border-red-400' : 'border-gray-300'} rounded-lg text-base text-gray-900 outline-none focus:border-black transition-colors placeholder:text-gray-400`} placeholder="Confirm your password" />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start gap-3 py-1">
              <input id="marketing" type="checkbox" {...register('marketingEmails')} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer" />
              <label htmlFor="marketing" className="text-sm text-black cursor-pointer select-none">
                Join our newsletter for exclusive restocks and new arrivals.
              </label>
            </div>

            <button type="submit" disabled={isAuthLoading} className="w-full py-3 bg-black text-white text-base font-semibold rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isAuthLoading ? (
                <svg className="animate-spin h-4 w-4 mx-auto" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-base text-black">Already have an account? </span>
            <Link href="/login" className="text-base font-semibold text-black hover:underline">Sign In</Link>
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
