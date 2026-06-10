import type { handleUnaryCall } from '@grpc/grpc-js';
import jwt from 'jsonwebtoken';
import { getJwtConfig } from '../config/env-config';
import { userService } from '../services/user.service';
import { emailService } from '../services/email.service';
import { logger } from '../utils/logger';
import type { UserProfile } from './types';

interface LoginRequest { email: string; password: string }
interface LoginResponse { success: boolean; message: string; email: string }
interface SignupRequest { name: string; email: string; password: string }
interface SignupResponse { success: boolean; message: string; user: UserProfile | null }
interface VerifyOtpRequest { email: string; otp: string }
interface AuthResponse { success: boolean; message: string; user: UserProfile | null; accessToken: string; refreshToken: string }
interface RefreshTokenRequest { refreshToken: string }
interface ForgotPasswordRequest { email: string }
interface ResetPasswordRequest { email: string; token: string; newPassword: string }
interface ChangePasswordRequest { currentPassword: string; newPassword: string; accessToken: string }
interface LogoutRequest {}
interface VerifyCredentialsRequest { email: string; password: string }
interface VerifyCredentialsResponse { success: boolean; message: string; user: UserProfile | null }
interface GetProfileRequest { accessToken: string }

function sanitize(user: { id: string; email: string; name: string; role: string }): UserProfile {
  return { id: user.id, email: user.email, name: user.name, role: user.role, isActive: true, emailVerified: true, createdAt: '', updatedAt: '' };
}

export const login: handleUnaryCall<LoginRequest, LoginResponse> = async (call, callback) => {
  try {
    const { email, password } = call.request;
    const user = await userService.findUserByEmail(email);
    if (!user) { callback(null, { success: false, message: 'No account found with this email address', email: '' }); return; }
    if (!user.isActive) { callback(null, { success: false, message: 'Account is deactivated', email: '' }); return; }
    const valid = await userService.validatePassword(password, user.password);
    if (!valid) { callback(null, { success: false, message: 'Incorrect password', email: '' }); return; }
    const otp = userService.generateOTP();
    await userService.storeOTP(email, otp);
    await emailService.sendLoginOtp(email, otp);
    callback(null, { success: true, message: 'OTP sent to your email', email: user.email });
  } catch (error) {
    logger.error('gRPC Login error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', email: '' });
  }
};

export const signup: handleUnaryCall<SignupRequest, SignupResponse> = async (call, callback) => {
  try {
    const { name, email, password } = call.request;
    const existing = await userService.findUserByEmail(email);
    if (existing) { callback(null, { success: false, message: 'User with this email already exists', user: null }); return; }
    const newUser = await userService.createUser(name, email, password);
    emailService.sendWelcomeEmail(email, name).catch(e => logger.error('Welcome email failed', { email }, e as Error));
    callback(null, {
      success: true,
      message: 'Account created successfully',
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role, isActive: newUser.isActive, emailVerified: false, createdAt: newUser.createdAt.toISOString(), updatedAt: newUser.updatedAt.toISOString() },
    });
  } catch (error) {
    logger.error('gRPC Signup error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', user: null });
  }
};

export const verifyOtp: handleUnaryCall<VerifyOtpRequest, AuthResponse> = async (call, callback) => {
  try {
    const { email, otp } = call.request;
    const valid = await userService.verifyOTP(email, otp);
    if (!valid) { callback(null, { success: false, message: 'Invalid or expired OTP', user: null, accessToken: '', refreshToken: '' }); return; }
    const user = await userService.findUserByEmail(email);
    if (!user || !user.isActive) { callback(null, { success: false, message: 'User not found', user: null, accessToken: '', refreshToken: '' }); return; }
    const accessToken = userService.generateAccessToken(user.id, user.email, user.role);
    const refreshToken = userService.generateRefreshToken(user.id, user.email);
    callback(null, {
      success: true, message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name, role: user.role, isActive: user.isActive, emailVerified: true, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() },
      accessToken, refreshToken,
    });
  } catch (error) {
    logger.error('gRPC VerifyOtp error', undefined, error as Error);
    callback(null, { success: false, message: 'Internal error', user: null, accessToken: '', refreshToken: '' });
  }
};

export const refreshToken: handleUnaryCall<RefreshTokenRequest, AuthResponse> = async (call, callback) => {
  try {
    const { refreshToken: token } = call.request;
    const jwtConfig = getJwtConfig();
    const decoded = jwt.verify(token, jwtConfig.refreshSecret) as { userId: string; email: string };
    const user = await userService.findUserById(decoded.userId);
    if (!user || !user.isActive) { callback(null, { success: false, message: 'User not found', user: null, accessToken: '', refreshToken: '' }); return; }
    const newAccessToken = userService.generateAccessToken(user.id, user.email, user.role);
    const newRefreshToken = userService.generateRefreshToken(user.id, user.email);
    callback(null, { success: true, message: 'Token refreshed', user: sanitize(user), accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch {
    callback(null, { success: false, message: 'Invalid refresh token', user: null, accessToken: '', refreshToken: '' });
  }
};

export const forgotPassword: handleUnaryCall<ForgotPasswordRequest, any> = async (call, callback) => {
  try {
    const { email } = call.request;
    const user = await userService.findUserByEmail(email);
    if (user) {
      const resetToken = await userService.generateResetToken(email);
      const resetLink = `${process.env.ADMIN_URL || process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;
      await emailService.sendPasswordResetLink(email, resetLink);
    }
    callback(null, { success: true, message: 'If email exists, reset link has been sent', error: null });
  } catch (error) {
    callback(null, { success: false, message: 'Internal error', error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const resetPassword: handleUnaryCall<ResetPasswordRequest, any> = async (call, callback) => {
  try {
    const { email, token, newPassword } = call.request;
    const valid = await userService.validateResetToken(token, email);
    if (!valid) { callback(null, { success: false, message: 'Invalid or expired reset token', error: { message: 'Invalid token', code: 'INVALID_TOKEN', details: {} } }); return; }
    const user = await userService.findUserByEmail(email);
    if (!user) { callback(null, { success: false, message: 'User not found', error: { message: 'Not found', code: 'NOT_FOUND', details: {} } }); return; }
    await userService.updateUserPassword(email, newPassword);
    await userService.consumeResetToken(token);
    callback(null, { success: true, message: 'Password reset successful', error: null });
  } catch (error) {
    callback(null, { success: false, message: 'Internal error', error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const changePassword: handleUnaryCall<ChangePasswordRequest, any> = async (call, callback) => {
  try {
    const { currentPassword, newPassword, accessToken } = call.request;
    const jwtConfig = getJwtConfig();
    const decoded = jwt.verify(accessToken, jwtConfig.secret) as { userId: string; email: string };
    const user = await userService.findUserById(decoded.userId);
    if (!user) { callback(null, { success: false, message: 'User not found', error: { message: 'Not found', code: 'NOT_FOUND', details: {} } }); return; }
    const valid = await userService.validatePassword(currentPassword, user.password);
    if (!valid) { callback(null, { success: false, message: 'Current password is incorrect', error: { message: 'Invalid password', code: 'INVALID_PASSWORD', details: {} } }); return; }
    await userService.updateUserPassword(user.email, newPassword);
    callback(null, { success: true, message: 'Password changed successfully', error: null });
  } catch (error) {
    callback(null, { success: false, message: 'Internal error', error: { message: 'Internal error', code: 'INTERNAL', details: {} } });
  }
};

export const logout: handleUnaryCall<LogoutRequest, any> = async (_call, callback) => {
  callback(null, { success: true, message: 'Logout successful', error: null });
};

export const verifyCredentials: handleUnaryCall<VerifyCredentialsRequest, VerifyCredentialsResponse> = async (call, callback) => {
  try {
    const { email, password } = call.request;
    const user = await userService.findUserByEmail(email);
    if (!user) { callback(null, { success: false, message: 'No account found', user: null }); return; }
    const valid = await userService.validatePassword(password, user.password);
    if (!valid) { callback(null, { success: false, message: 'Incorrect password', user: null }); return; }
    callback(null, { success: true, message: 'Credentials verified', user: sanitize(user) });
  } catch (error) {
    callback(null, { success: false, message: 'Internal error', user: null });
  }
};

export const getProfile: handleUnaryCall<GetProfileRequest, UserProfile> = async (call, callback) => {
  try {
    const { accessToken } = call.request;
    const jwtConfig = getJwtConfig();
    const decoded = jwt.verify(accessToken, jwtConfig.secret) as { userId: string; email: string };
    const user = await userService.findUserById(decoded.userId);
    if (!user || !user.isActive) { callback(null, { id: '', email: '', name: '', role: '', isActive: false, emailVerified: false, createdAt: '', updatedAt: '' }); return; }
    callback(null, { id: user.id, email: user.email, name: user.name, role: user.role, isActive: user.isActive, emailVerified: true, createdAt: user.createdAt.toISOString(), updatedAt: user.updatedAt.toISOString() });
  } catch {
    callback(null, { id: '', email: '', name: '', role: '', isActive: false, emailVerified: false, createdAt: '', updatedAt: '' });
  }
};

export const authHandlers = {
  Login: login,
  Signup: signup,
  VerifyOtp: verifyOtp,
  RefreshToken: refreshToken,
  ForgotPassword: forgotPassword,
  ResetPassword: resetPassword,
  ChangePassword: changePassword,
  Logout: logout,
  VerifyCredentials: verifyCredentials,
  GetProfile: getProfile,
};
