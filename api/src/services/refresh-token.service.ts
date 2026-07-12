import crypto from 'crypto';
import { prisma } from '../lib/database';

const hashToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');

export const storeRefreshToken = async (
  userId: string,
  token: string,
  ttlSeconds: number,
): Promise<void> => {
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

  await prisma.refreshToken.create({
    data: { tokenHash, userId, expiresAt },
  });
};

export const validateRefreshToken = async (
  userId: string,
  token: string,
): Promise<boolean> => {
  const tokenHash = hashToken(token);

  const stored = await prisma.refreshToken.findFirst({
    where: { tokenHash, userId, expiresAt: { gt: new Date() } },
  });

  return stored !== null;
};

export const rotateRefreshToken = async (
  oldToken: string,
  newToken: string,
  userId: string,
  ttlSeconds: number,
): Promise<void> => {
  const oldHash = hashToken(oldToken);
  const newHash = hashToken(newToken);
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

  await prisma.$transaction([
    prisma.refreshToken.deleteMany({ where: { tokenHash: oldHash, userId } }),
    prisma.refreshToken.create({
      data: { tokenHash: newHash, userId, expiresAt },
    }),
  ]);
};

export const revokeAllUserTokens = async (userId: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({ where: { userId } });
};

export const cleanupExpiredTokens = async (): Promise<void> => {
  await prisma.refreshToken.deleteMany({ where: { expiresAt: { lte: new Date() } } });
};
