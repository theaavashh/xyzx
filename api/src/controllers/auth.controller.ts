import type { Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtConfig } from '../config/env-config';
import { emailService } from '../services/email.service';
import { totpService } from '../services/totp.service';
import { userService } from '../services/user.service';
import { logger } from '../utils/logger';
import {
  asyncHandler,
  sendBadRequest,
  sendConflict,
  sendCreated,
  sendNotFound,
  sendSuccess,
  sendUnauthorized,
} from '../utils';

const getCookieOptions = (maxAgeMs: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: maxAgeMs,
  path: '/',
});

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  const jwtConfig = getJwtConfig();

  const accessMaxAge = typeof jwtConfig.expiresIn === 'string'
    ? parseDurationToMs(jwtConfig.expiresIn)
    : 15 * 60 * 1000;

  const refreshMaxAge = typeof jwtConfig.refreshExpiresIn === 'string'
    ? parseDurationToMs(jwtConfig.refreshExpiresIn)
    : 7 * 24 * 60 * 60 * 1000;

  res.cookie('accessToken', accessToken, getCookieOptions(accessMaxAge));
  res.cookie('refreshToken', refreshToken, getCookieOptions(refreshMaxAge));
};

const parseDurationToMs = (duration: string): number => {
  const match = duration.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return 15 * 60 * 1000;
  const value = parseInt(match[1]!, 10);
  const unit = match[2];
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 15 * 60 * 1000;
  }
};

const sanitizeUser = (user: { id: string; email: string; name: string; role: string }) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
});

export const verifyCredentials: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await userService.findUserByEmail(email);
    if (!user) {
      sendUnauthorized(res, 'No account found with this email address');
      return;
    }

    const isPasswordValid = await userService.validatePassword(password, user.password);
    if (!isPasswordValid) {
      sendUnauthorized(res, 'Incorrect password. Please try again.');
      return;
    }

    sendSuccess(res, { user: sanitizeUser(user) });
  },
);

export const login: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userService.findUserByEmail(email);
  if (!user) {
    sendUnauthorized(res, 'No account found with this email address');
    return;
  }

  if (!user.isActive) {
    sendUnauthorized(res, 'Your account has been deactivated. Please contact support.');
    return;
  }

  const isPasswordValid = await userService.validatePassword(password, user.password);
  if (!isPasswordValid) {
    sendUnauthorized(res, 'Incorrect password. Please try again.');
    return;
  }

  const otp = userService.generateOTP();
  await userService.storeOTP(email, otp);
  await emailService.sendLoginOtp(email, otp);

  sendSuccess(res, { email: user.email }, 'OTP sent to your email');
});

export const verifyOtp: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const isOtpValid = await userService.verifyOTP(email, otp);
  if (!isOtpValid) {
    sendBadRequest(res, 'Invalid or expired OTP');
    return;
  }

  const user = await userService.findUserByEmail(email);
  if (!user) {
    sendNotFound(res, 'User not found');
    return;
  }

  if (!user.isActive) {
    sendUnauthorized(res, 'Your account has been deactivated. Please contact support.');
    return;
  }

  const accessToken = userService.generateAccessToken(user.id, user.email, user.role);
  const refreshToken = userService.generateRefreshToken(user.id, user.email);

  setAuthCookies(res, accessToken, refreshToken);

  sendSuccess(res, { user: sanitizeUser(user), accessToken, refreshToken }, 'Login successful');
});

export const forgotPassword: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await userService.findUserByEmail(email);
    if (!user) {
      sendSuccess(res, null, 'If email exists, reset link has been sent');
      return;
    }

    const resetToken = await userService.generateResetToken(email);
    const resetLink = `${process.env.ADMIN_URL || process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;
    await emailService.sendPasswordResetLink(email, resetLink);

    sendSuccess(res, null, 'If email exists, reset link has been sent');
  },
);

export const resetPassword: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, token, newPassword } = req.body;

    const isValidToken = await userService.validateResetToken(token, email);
    if (!isValidToken) {
      sendBadRequest(res, 'Invalid or expired reset token');
      return;
    }

    const user = await userService.findUserByEmail(email);
    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    await userService.updateUserPassword(email, newPassword);
    await userService.consumeResetToken(token);

    sendSuccess(res, null, 'Password reset successful');
  },
);

export const generateTotpSecret: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.body;

    const user = await userService.findUserByEmail(userId);
    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    const totpSecret = totpService.generateSecret(user.email);
    await userService.storeTotpSecret(user.id, totpSecret.secret, totpSecret.backupCodes || []);
    const qrCodeImage = await totpService.generateQRCodeImage(totpSecret.qrCode);

    sendSuccess(
      res,
      {
        secret: totpSecret.secret,
        qrCode: qrCodeImage,
        backupCodes: totpSecret.backupCodes,
        manualEntryKey: totpSecret.qrCode,
      },
      'TOTP secret generated successfully',
    );
  },
);

export const verifyTotpSetup: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, token } = req.body;

    const user = await userService.findUserByEmail(userId);
    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    const totpData = await userService.getTotpSecret(user.id);
    if (!totpData) {
      sendBadRequest(res, 'TOTP not set up for this user');
      return;
    }

    const verification = totpService.verifyToken(totpData.secret, token);
    if (verification.valid) {
      await userService.enableTotp(user.id);
      sendSuccess(res, null, 'TOTP verification successful and enabled');
    } else {
      sendBadRequest(res, 'Invalid TOTP token');
    }
  },
);

export const loginWithTotp: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password, totpToken } = req.body;

    const user = await userService.findUserByEmail(email);
    if (!user) {
      sendUnauthorized(res, 'Invalid email or password');
      return;
    }

    if (!user.isActive) {
      sendUnauthorized(res, 'Your account has been deactivated. Please contact support.');
      return;
    }

    const isPasswordValid = await userService.validatePassword(password, user.password);
    if (!isPasswordValid) {
      sendUnauthorized(res, 'Invalid email or password');
      return;
    }

    const totpData = await userService.getTotpSecret(user.id);
    if (!totpData || !totpData.isEnabled) {
      sendBadRequest(res, 'TOTP is not enabled for this account');
      return;
    }

    const verification = await userService.verifyTotpToken(user.id, totpToken);
    if (verification.valid) {
      if (verification.isBackupCode) {
        await userService.consumeBackupCode(user.id, totpToken);
      }

      const accessToken = userService.generateAccessToken(user.id, user.email, user.role);
      const refreshToken = userService.generateRefreshToken(user.id, user.email);

      setAuthCookies(res, accessToken, refreshToken);

      sendSuccess(
        res,
        {
          user: sanitizeUser(user),
          usedBackupCode: verification.isBackupCode,
        },
        'Login successful',
      );
    } else {
      sendBadRequest(res, 'Invalid TOTP token');
    }
  },
);

export const disableTotp: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const { userId, password } = req.body;

  const user = await userService.findUserByEmail(userId);
  if (!user) {
    sendNotFound(res, 'User not found');
    return;
  }

  const isPasswordValid = await userService.validatePassword(password, user.password);
  if (!isPasswordValid) {
    sendUnauthorized(res, 'Invalid password');
    return;
  }

  await userService.disableTotp(user.id);
  sendSuccess(res, null, 'TOTP disabled successfully');
});

export const signup: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await userService.findUserByEmail(email);
  if (existingUser) {
    sendConflict(res, 'User with this email already exists');
    return;
  }

  const newUser = await userService.createUser(name, email, password);

  try {
    await emailService.sendWelcomeEmail(email, name);
  } catch (emailError) {
    logger.error('Failed to send welcome email', { email, name }, emailError as Error);
  }

  sendCreated(
    res,
    {
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    },
    'Account created successfully',
  );
});

export const getProfile: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    sendUnauthorized(res, 'Not authenticated');
    return;
  }

  const jwtConfig = getJwtConfig();
  const decoded = jwt.verify(accessToken, jwtConfig.secret) as {
    userId: string;
    email: string;
  };

  const user = await userService.findUserById(decoded.userId);
  if (!user || !user.isActive) {
    sendUnauthorized(res, 'Not authenticated');
    return;
  }

  sendSuccess(res, {
    id: user.id,
    email: user.email,
    username: user.email.split('@')[0] || 'user',
    firstName: user.name?.split(' ')[0] || 'User',
    lastName: user.name?.split(' ')[1] || 'User',
    role: user.role || 'admin',
    isActive: user.isActive,
    emailVerified: true,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  });
});

export const refreshAccessToken: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    sendUnauthorized(res, 'No refresh token');
    return;
  }

  const jwtConfig = getJwtConfig();

  try {
    const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret) as {
      userId: string;
      email: string;
    };

    const user = await userService.findUserById(decoded.userId);
    if (!user || !user.isActive) {
      res.clearCookie('refreshToken', getCookieOptions(0));
      sendUnauthorized(res, 'User not found or deactivated');
      return;
    }

    const newAccessToken = userService.generateAccessToken(user.id, user.email, user.role);
    const newRefreshToken = userService.generateRefreshToken(user.id, user.email);

    setAuthCookies(res, newAccessToken, newRefreshToken);

    sendSuccess(res, { user: sanitizeUser(user) }, 'Token refreshed successfully');
  } catch (error) {
    res.clearCookie('refreshToken', getCookieOptions(0));
    res.clearCookie('accessToken', getCookieOptions(0));
    sendUnauthorized(res, 'Invalid or expired refresh token');
  }
});

export const changePassword: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
      sendUnauthorized(res, 'Not authenticated');
      return;
    }

    const jwtConfig = getJwtConfig();
    const decoded = jwt.verify(accessToken, jwtConfig.secret) as {
      userId: string;
      email: string;
    };

    const user = await userService.findUserById(decoded.userId);
    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    const isPasswordValid = await userService.validatePassword(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      sendUnauthorized(res, 'Current password is incorrect');
      return;
    }

    await userService.updateUserPassword(user.email, newPassword);

    sendSuccess(res, null, 'Password changed successfully');
  },
);

export const logout: RequestHandler = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie('accessToken', getCookieOptions(0));
  res.clearCookie('refreshToken', getCookieOptions(0));

  sendSuccess(res, null, 'Logout successful');
});
