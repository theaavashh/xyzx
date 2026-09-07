export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    accessToken?: string;
    refreshToken?: string;
  };
}

export type LoginStep = 'login' | 'otp' | 'forgotPassword' | 'resetPassword';

export interface UseLoginReturn {
  isLoading: boolean;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  handleSubmit: (data: LoginFormData) => Promise<void>;
  handleVerifyOtp: (otp: string) => Promise<void>;
  handleForgotPassword: (email: string) => Promise<void>;
  handleResendOtp: () => Promise<void>;
  resendCooldown: number;
  step: LoginStep;
  pendingEmail: string;
  backToLogin: () => void;
  setStep: (step: LoginStep) => void;
}
