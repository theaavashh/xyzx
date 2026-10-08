import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { IUserService, User, OtpRecord, ResetTokenRecord, TotpData, TotpVerificationResult, USER_SERVICE_TOKEN } from '../interfaces/services/user.service.js';
import { IUserRepository } from '../interfaces/repositories/user.repository.js';
import { ICacheService } from '../interfaces/services/cache.service.js';
import { verifyToken as verifyTotpToken } from './totp.service.js';
import { logger } from '../utils/logger.js';
import { getJwtConfig } from '../config/env-config.js';

const OTP_TTL = 15 * 60;
const RESET_TOKEN_TTL = 15 * 60;

const getOtpKey = (email: string): string => `otp:${email.toLowerCase()}`;
const getResetTokenKey = (token: string): string => `reset_token:${token}`;
const getTotpKey = (userId: string): string => `totp:${userId}`;

const getBcryptSaltRounds = (): number => {
  return parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
};

const hashBackupCodes = async (codes: string[]): Promise<string[]> => {
  const bcrypt = await import('bcryptjs');
  const cost = Math.min(getBcryptSaltRounds(), 10);
  return Promise.all(codes.map((code) => bcrypt.hash(code.toUpperCase(), cost)));
};

export const createUserService = (
  userRepository: IUserRepository,
  cacheService: ICacheService,
): IUserService => {
  const findUserByEmail = async (email: string): Promise<User | undefined> => {
    try {
      const user = await userRepository.findUserByEmail(email);
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

  const findUserById = async (id: string): Promise<User | undefined> => {
    try {
      const user = await userRepository.findUserById(id);
      if (user) {
        return {
          id: user.id,
          email: user.email,
          password: '', // Not needed for public profile
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

  const validatePassword = async (
    password: string,
    hashedPassword: string,
  ): Promise<boolean> => {
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(password, hashedPassword);
  };

  const generateOTP = (): string =>
    crypto.randomInt(100000, 999999).toString();

  const storeOTP = async (email: string, otp: string): Promise<void> => {
    const otpExpiry = Date.now() + OTP_TTL * 1000;
    await cacheService.set(
      getOtpKey(email),
      { otp, expiresAt: otpExpiry },
      OTP_TTL,
    );
  };

  const verifyOTP = async (
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

  const generateAccessToken = (
    userId: string,
    email: string,
    role?: string,
  ): string => {
    const jwtConfig = getJwtConfig();
    return jwt.sign({ userId, email, role }, String(jwtConfig.secret), {
      expiresIn: String(jwtConfig.expiresIn),
    } as jwt.SignOptions);
  };

  const generateRefreshToken = (userId: string, email: string): string => {
    const jwtConfig = getJwtConfig();
    return jwt.sign({ userId, email }, String(jwtConfig.refreshSecret), {
      expiresIn: String(jwtConfig.refreshExpiresIn),
    } as jwt.SignOptions);
  };

  const generateResetToken = async (email: string): Promise<string> => {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = Date.now() + RESET_TOKEN_TTL * 1000;
    await cacheService.set(
      getResetTokenKey(token),
      { email, expiresAt: tokenExpiry },
      RESET_TOKEN_TTL,
    );
    return token;
  };

  const validateResetToken = async (
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

  const consumeResetToken = async (token: string): Promise<void> => {
    await cacheService.delete(getResetTokenKey(token));
  };

  const updateUserPassword = async (
    email: string,
    newPassword: string,
  ): Promise<void> => {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, getBcryptSaltRounds());
    await userRepository.updateUser(email, { password: hashedPassword });
  };

  const createUser = async (
    name: string,
    email: string,
    password: string,
  ): Promise<User> => {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, getBcryptSaltRounds());
    const user = await userRepository.createUser({
      name,
      email,
      password: hashedPassword,
      role: 'user',
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

  const storeTotpSecret = async (
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

  const enableTotp = async (userId: string): Promise<void> => {
    const totpData = await getTotpSecret(userId);
    if (totpData) {
      totpData.isEnabled = true;
      await cacheService.set(getTotpKey(userId), totpData);
    }
  };

  const getTotpSecret = async (userId: string): Promise<TotpData | null> =>
    cacheService.get(getTotpKey(userId));

  const verifyTotpTokenFn = async (
    userId: string,
    token: string,
  ): Promise<TotpVerificationResult> => {
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

  const consumeBackupCode = async (
    userId: string,
    backupCode: string,
  ): Promise<boolean> => {
    const totpData = await getTotpSecret(userId);
    if (!totpData) return false;

    const bcrypt = await import('bcryptjs');
    let found = false;
    totpData.backupCodes = totpData.backupCodes.filter((hashedCode: string) => {
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

  const disableTotp = async (userId: string): Promise<void> => {
    await cacheService.delete(getTotpKey(userId));
  };

  return {
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
};

export { USER_SERVICE_TOKEN };