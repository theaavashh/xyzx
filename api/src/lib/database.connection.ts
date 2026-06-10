import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const isDev = process.env.NODE_ENV !== 'production';

const prismaClientOptions = {
  log: isDev ? (['error', 'warn', 'query'] as const) : (['error'] as const),
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};

export const prisma = new PrismaClient(prismaClientOptions as any);

export const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database', undefined, error as Error);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Error disconnecting from database', undefined, error as Error);
    throw error;
  }
};

export const healthCheck = async (timeoutMs = 5000): Promise<boolean> => {
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database health check timeout')), timeoutMs),
      ),
    ]);
    return true;
  } catch (error) {
    logger.error('Database health check failed', undefined, error as Error);
    return false;
  }
};

process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully');
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully');
  await disconnectDB();
  process.exit(0);
});

process.on('beforeExit', async () => {
  logger.info('Process is about to exit, closing database connections');
  await disconnectDB();
});

export type { PrismaClient };
