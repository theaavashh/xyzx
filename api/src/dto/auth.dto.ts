import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const otpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 characters'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const verifyCredentialsSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const totpSetupSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

export const verifyTotpSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  token: z.string().min(1, 'TOTP token is required'),
});

export const loginWithTotpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  totpToken: z.string().min(1, 'TOTP token is required'),
});

export const disableTotpSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type OtpDTO = z.infer<typeof otpSchema>;
export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
export type SignupDTO = z.infer<typeof signupSchema>;
export type VerifyCredentialsDTO = z.infer<typeof verifyCredentialsSchema>;
export type TotpSetupDTO = z.infer<typeof totpSetupSchema>;
export type VerifyTotpDTO = z.infer<typeof verifyTotpSchema>;
export type LoginWithTotpDTO = z.infer<typeof loginWithTotpSchema>;
export type DisableTotpDTO = z.infer<typeof disableTotpSchema>;
