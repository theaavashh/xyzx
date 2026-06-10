export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role?: string;
  iat: number;
  exp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface OtpVerificationRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface TotpSetupRequest {
  userId: string;
}

export interface TotpVerifyRequest {
  userId: string;
  token: string;
}

export interface TotpLoginRequest {
  email: string;
  password: string;
  totpToken: string;
}

export interface RefreshTokenRequest {
  refreshToken?: string;
}

export interface LoginResponse {
  user: SanitizedUser;
  accessToken?: string;
  refreshToken?: string;
}

export interface SanitizedUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const sanitizeUser = (user: User): SanitizedUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
});

export const userToProfile = (user: User): UserProfile => ({
  id: user.id,
  email: user.email,
  username: user.email.split('@')[0] || 'user',
  firstName: user.name?.split(' ')[0] || 'User',
  lastName: user.name?.split(' ')[1] || 'User',
  role: user.role || 'user',
  isActive: user.isActive,
  emailVerified: true,
  createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
  updatedAt: user.updatedAt?.toISOString() || new Date().toISOString(),
});