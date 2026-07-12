'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { LogoHeader, LoginForm, useLogin } from '@/features/login';
import { LoginFormData } from '@/features/login/types/login.types';
import { OtpInput } from '@/features/login/components/OtpInput';

export default function AdminLogin() {
  const {
    isLoading,
    showPassword,
    togglePasswordVisibility,
    handleSubmit,
    handleVerifyOtp,
    handleForgotPassword,
    step,
    pendingEmail,
    backToLogin,
    setStep,
  } = useLogin();

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');

  const loginForm = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const handleForgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    await handleForgotPassword(forgotEmail);
    setForgotSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
        <LogoHeader />

        {step === 'login' && (
          <form
            onSubmit={loginForm.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <LoginForm
              register={loginForm.register}
              errors={loginForm.formState.errors}
              handleSubmit={loginForm.handleSubmit}
              onSubmit={handleSubmit}
              showPassword={showPassword}
              onTogglePassword={togglePasswordVisibility}
              onForgotPassword={() => {
                if (loginForm.getValues('email')) {
                  setForgotEmail(loginForm.getValues('email'));
                }
                setStep('forgotPassword');
                setForgotSent(false);
              }}
              isLoading={isLoading}
            />
          </form>
        )}

        {step === 'otp' && (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Verify OTP
              </h2>
              <p className="text-base text-gray-500 mt-2 font-medium">
                Enter the 6-digit code sent to{' '}
                <span className="font-bold text-gray-900">{pendingEmail}</span>
              </p>
            </div>
            <OtpInput
              length={6}
              value={otpValue}
              onChange={setOtpValue}
              isLoading={isLoading}
            />
            <button
              type="button"
              onClick={() => handleVerifyOtp(otpValue)}
              disabled={otpValue.length !== 6 || isLoading}
              className="w-full bg-[#D4AF37] text-white py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base font-bold"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  backToLogin();
                  setOtpValue('');
                }}
                className="text-base font-semibold text-gray-500 hover:text-gray-900"
                disabled={isLoading}
              >
                Back to login
              </button>
            </div>
          </div>
        )}

        {step === 'forgotPassword' && !forgotSent && (
          <form onSubmit={handleForgotSubmit} className="space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 outer-sans">
                Forgot Password
              </h2>
              <p className="text-base text-gray-500 mt-2 font-medium tracking-normal">
                Enter your email to receive a reset link
              </p>
            </div>
            <div>
              <label
                htmlFor="forgot-email"
                className="block text-base swastik font-bold text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#D4AF37] focus:outline-none focus:border-[#D4AF37] text-base font-medium text-black outline-none"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !forgotEmail.trim()}
              className="w-full bg-[#D4AF37] text-white py-3.5 rounded-xl  transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base font-bold"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={backToLogin}
                className="text-base font-semibold text-gray-500 hover:text-gray-900"
                disabled={isLoading}
              >
                Back to login
              </button>
            </div>
          </form>
        )}

        {step === 'forgotPassword' && forgotSent && (
          <div className="space-y-5 text-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Check Your Email
              </h2>
              <p className="text-base text-gray-500 mt-2 font-medium">
                If an account exists for{' '}
                <span className="font-bold text-gray-900">{forgotEmail}</span>, you&apos;ll
                receive a password reset link shortly.
              </p>
            </div>
            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl p-5 text-left">
              <p className="text-base font-semibold text-[#b8960f]">
                Click the link in the email to reset your password. The link
                expires in 15 minutes.
              </p>
            </div>
            <button
              type="button"
              onClick={backToLogin}
              className="w-full bg-[#D4AF37] text-white py-3.5 rounded-xl hover:bg-[#c9a32e] transition-colors text-base font-bold"
            >
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
