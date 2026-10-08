export interface OtpRecord {
  otp: string;
  expiresAt: number;
}

export interface ResetTokenRecord {
  email: string;
  expiresAt: number;
}

export interface TotpData {
  secret: string;
  backupCodes: string[];
  isEnabled: boolean;
}

export interface TotpVerificationResult {
  valid: boolean;
  isBackupCode: boolean;
}

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

export interface IUserService {
  findUserByEmail(email: string): Promise<User | undefined>;
  findUserById(id: string): Promise<User | undefined>;
  validatePassword(password: string, hashedPassword: string): Promise<boolean>;
  generateOTP(): string;
  storeOTP(email: string, otp: string): Promise<void>;
  verifyOTP(email: string, otp: string): Promise<boolean>;
  generateAccessToken(userId: string, email: string, role?: string): string;
  generateRefreshToken(userId: string, email: string): string;
  generateResetToken(email: string): Promise<string>;
  validateResetToken(token: string, email: string): Promise<boolean>;
  consumeResetToken(token: string): Promise<void>;
  updateUserPassword(email: string, newPassword: string): Promise<void>;
  createUser(name: string, email: string, password: string): Promise<User>;
  storeTotpSecret(userId: string, secret: string, backupCodes: string[]): Promise<void>;
  enableTotp(userId: string): Promise<void>;
  getTotpSecret(userId: string): Promise<TotpData | null>;
  verifyTotpToken(userId: string, token: string): Promise<TotpVerificationResult>;
  consumeBackupCode(userId: string, backupCode: string): Promise<boolean>;
  disableTotp(userId: string): Promise<void>;
}

export const USER_SERVICE_TOKEN = 'USER_SERVICE';