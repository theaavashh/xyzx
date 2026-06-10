import QRCode from 'qrcode';
import speakeasy from 'speakeasy';
import { logger } from '../utils/logger';

export interface TotpSecret {
  secret: string;
  qrCode: string;
  backupCodes?: string[];
}

export interface TotpVerification {
  valid: boolean;
  delta?: number;
}

const generateBackupCodes = (count: number = 10): string[] => {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
  }
  return codes;
};

export const generateSecret = (userEmail: string): TotpSecret => {
  const secret = speakeasy.generateSecret({
    name: `Rapharch Admin (${userEmail})`,
    issuer: 'Rapharch Admin Panel',
    length: 32,
  });

  const qrCodeUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label: `Rapharch Admin (${userEmail})`,
    issuer: 'Rapharch Admin Panel',
  });

  return {
    secret: secret.base32,
    qrCode: qrCodeUrl,
    backupCodes: generateBackupCodes(),
  };
};

export const verifyToken = (
  secret: string,
  token: string,
  window: number = 2,
): TotpVerification => {
  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window,
  });

  return {
    valid: verified,
    delta: verified ? 0 : undefined,
  };
};

export const generateQRCodeImage = async (
  qrCodeUrl: string,
): Promise<string> => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    logger.error('Error generating QR code', undefined, error as Error);
    throw new Error('Failed to generate QR code');
  }
};

export const verifyBackupCode = (
  storedCodes: string[],
  providedCode: string,
): boolean => {
  return storedCodes.includes(providedCode.toUpperCase());
};

export const removeBackupCode = (
  codes: string[],
  usedCode: string,
): string[] => {
  return codes.filter((code) => code !== usedCode.toUpperCase());
};

export const totpService = {
  generateSecret,
  verifyToken,
  generateQRCodeImage,
  verifyBackupCode,
  removeBackupCode,
};
