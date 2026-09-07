import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContextTanStack';
import { verifyOtpRequest, resendOtpRequest, forgotPasswordRequest, tokenRefreshManager } from '@/services/apiClient';
import { LoginFormData, UseLoginReturn, LoginStep } from '../types/login.types';
import toast from 'react-hot-toast';
import { queryClient } from '@/contexts/AuthContextTanStack';
import { setCookie } from '@/utils/cookie';
import { setAccessToken } from '@/utils/authToken';

const RESEND_COOLDOWN_SECONDS = 30;

export function useLogin(): UseLoginReturn {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStepState] = useState<LoginStep>('login');
  const [pendingEmail, setPendingEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const isSubmittingRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const setStep = (s: LoginStep) => {
    setStepState(s);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (data: LoginFormData) => {
    if (isSubmittingRef.current || isLoading) return;
    isSubmittingRef.current = true;
    setIsLoading(true);
    try {
      const success = await login(data.email, data.password);

      if (success) {
        setPendingEmail(data.email);
        setStep('otp');
      }
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    if (isSubmittingRef.current || isLoading) return;
    isSubmittingRef.current = true;
    setIsLoading(true);
    try {
      const result = await verifyOtpRequest(pendingEmail, otp);

      if (result.success) {
        if (result.data?.accessToken) {
          setCookie('accessToken', result.data.accessToken, 900);
          setAccessToken(result.data.accessToken);
        }
        if (result.data?.refreshToken) {
          setCookie('refreshToken', result.data.refreshToken, 604800);
        }
        tokenRefreshManager.reset();
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        router.push('/dashboard');
      } else {
        setIsLoading(false);
        isSubmittingRef.current = false;
        throw new Error(result.message || 'Invalid OTP');
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to verify OTP';
      toast.error(message);
      setStep('login');
      setPendingEmail('');
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const result = await forgotPasswordRequest(email);

      if (!result.success) {
        throw new Error(result.message || 'Failed to send reset link');
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to send reset link';
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = useCallback(async () => {
    if (isLoading || !pendingEmail || resendCooldown > 0) return;
    setIsLoading(true);
    try {
      const result = await resendOtpRequest(pendingEmail);
      if (!result.success) {
        throw new Error(result.message || 'Failed to resend OTP');
      }
      toast.success('OTP sent to your email');
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to resend OTP';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, pendingEmail, resendCooldown]);

  const backToLogin = () => {
    setStep('login');
    setPendingEmail('');
  };

  return {
    isLoading,
    showPassword,
    togglePasswordVisibility,
    handleSubmit,
    handleVerifyOtp,
    handleForgotPassword,
    handleResendOtp,
    resendCooldown,
    step,
    pendingEmail,
    backToLogin,
    setStep,
  };
}
