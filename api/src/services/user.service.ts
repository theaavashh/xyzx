import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/database';
import { cacheService } from './cache.service';
import { verifyToken as verifyTotpToken } from './totp.service';
import { logger } from '../utils/logger';
import { getJwtConfig } from '../config/env-config';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OtpRecord {
  otp: string;
  expiresAt: number;
}

export interface ResetTokenRecord {
  email: string;
  expiresAt: number;
}

const OTP_TTL = 15 * 60;
const RESET_TOKEN_TTL = 15 * 60;

const getOtpKey = (email: string): string => `otp:${email.toLowerCase()}`;
const getResetTokenKey = (token: string): string => `reset_token:${token}`;
const getTotpKey = (userId: string): string => `totp:${userId}`;

export const findUserByEmail = async (
  email: string,
): Promise<User | undefined> => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }
    return undefined;
  } catch (error) {
    logger.error('Error finding user by email', { email: email.substring(0, 5) + '***' }, error as Error);
    return undefined;
  }
};

export const findUserById = async (id: string): Promise<User | undefined> => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (user) {
      return {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }
    return undefined;
  } catch (error) {
    logger.error('Error finding user by ID', { userId: id }, error as Error);
    return undefined;
  }
};

export const validatePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hashedPassword);
};

export const generateOTP = (): string =>
  crypto.randomInt(100000, 999999).toString();

export const storeOTP = async (email: string, otp: string): Promise<void> => {
  const otpExpiry = Date.now() + OTP_TTL * 1000;
  await cacheService.set(
    getOtpKey(email),
    { otp, expiresAt: otpExpiry },
    OTP_TTL,
  );
};

export const verifyOTP = async (
  email: string,
  otp: string,
): Promise<boolean> => {
  const storedOtp = await cacheService.get<OtpRecord>(getOtpKey(email));

  if (!storedOtp) return false;
  if (storedOtp.otp !== otp) return false;

  if (Date.now() > storedOtp.expiresAt) {
    await cacheService.delete(getOtpKey(email));
    return false;
  }

  await cacheService.delete(getOtpKey(email));
  return true;
};

export const generateAccessToken = (
  userId: string,
  email: string,
  role?: string,
): string => {
  const jwtConfig = getJwtConfig();
  return jwt.sign({ userId, email, role }, String(jwtConfig.secret), {
    expiresIn: String(jwtConfig.expiresIn),
  } as jwt.SignOptions);
};

export const generateRefreshToken = (userId: string, email: string): string => {
  const jwtConfig = getJwtConfig();
  return jwt.sign({ userId, email }, String(jwtConfig.refreshSecret), {
    expiresIn: String(jwtConfig.refreshExpiresIn),
  } as jwt.SignOptions);
};

export const generateResetToken = async (email: string): Promise<string> => {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenExpiry = Date.now() + RESET_TOKEN_TTL * 1000;
  await cacheService.set(
    getResetTokenKey(token),
    { email, expiresAt: tokenExpiry },
    RESET_TOKEN_TTL,
  );
  return token;
};

export const validateResetToken = async (
  token: string,
  email: string,
): Promise<boolean> => {
  const storedToken = await cacheService.get<ResetTokenRecord>(
    getResetTokenKey(token),
  );

  if (!storedToken || storedToken.email !== email) return false;

  if (Date.now() > storedToken.expiresAt) {
    await cacheService.delete(getResetTokenKey(token));
    return false;
  }

  return true;
};

export const consumeResetToken = async (token: string): Promise<void> => {
  await cacheService.delete(getResetTokenKey(token));
};

const getBcryptSaltRounds = (): number => {
  return parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
};

export const updateUserPassword = async (
  email: string,
  newPassword: string,
): Promise<void> => {
  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.hash(newPassword, getBcryptSaltRounds());
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
): Promise<User> => {
  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, getBcryptSaltRounds());
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: 'user' },
  });

  return {
    id: user.id,
    email: user.email,
    password: user.password,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const hashBackupCodes = async (codes: string[]): Promise<string[]> => {
  const bcrypt = await import('bcryptjs');
  const cost = Math.min(parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10), 10);
  return Promise.all(codes.map((code) => bcrypt.hash(code.toUpperCase(), cost)));
};

export const storeTotpSecret = async (
  userId: string,
  secret: string,
  backupCodes: string[],
): Promise<void> => {
  const hashedCodes = await hashBackupCodes(backupCodes);
  await cacheService.set(getTotpKey(userId), {
    secret,
    backupCodes: hashedCodes,
    isEnabled: false,
  });
};

export const enableTotp = async (userId: string): Promise<void> => {
  const totpData = await getTotpSecret(userId);
  if (totpData) {
    totpData.isEnabled = true;
    await cacheService.set(getTotpKey(userId), totpData);
  }
};

interface TotpData {
  secret: string;
  backupCodes: string[];
  isEnabled: boolean;
}

export const getTotpSecret = async (userId: string): Promise<TotpData | null> =>
  cacheService.get(getTotpKey(userId));

export const verifyTotpTokenFn = async (
  userId: string,
  token: string,
): Promise<{ valid: boolean; isBackupCode: boolean }> => {
  const totpData = await getTotpSecret(userId);
  if (!totpData) return { valid: false, isBackupCode: false };

  const bcrypt = await import('bcryptjs');
  for (const hashedCode of totpData.backupCodes) {
    if (await bcrypt.compare(token.toUpperCase(), hashedCode)) {
      return { valid: true, isBackupCode: true };
    }
  }

  const verification = verifyTotpToken(totpData.secret, token);
  return { valid: verification.valid, isBackupCode: false };
};

export const consumeBackupCode = async (
  userId: string,
  backupCode: string,
): Promise<boolean> => {
  const totpData = await getTotpSecret(userId);
  if (!totpData) return false;

  const bcrypt = await import('bcryptjs');
  let found = false;
  totpData.backupCodes = totpData.backupCodes.filter((hashedCode) => {
    if (!found && bcrypt.compareSync(backupCode.toUpperCase(), hashedCode)) {
      found = true;
      return false;
    }
    return true;
  });

  if (!found) return false;

  await cacheService.set(getTotpKey(userId), totpData);
  return true;
};

export const disableTotp = async (userId: string): Promise<void> => {
  await cacheService.delete(getTotpKey(userId));
};

export const userService = {
  findUserByEmail,
  findUserById,
  validatePassword,
  generateOTP,
  storeOTP,
  verifyOTP,
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  validateResetToken,
  consumeResetToken,
  updateUserPassword,
  createUser,
  storeTotpSecret,
  enableTotp,
  getTotpSecret,
  verifyTotpToken: verifyTotpTokenFn,
  consumeBackupCode,
  disableTotp,
};

export default userService;