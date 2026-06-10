import type { Request, RequestHandler, Response } from 'express';
import { prisma } from '../lib/database';
import { cacheService } from '../services/cache.service';
import { asyncHandler } from '../utils';

interface ServiceHealth {
  status: 'up' | 'down';
  latency?: number;
  message?: string;
}

const checkCache = async (): Promise<ServiceHealth> => {
  const start = Date.now();
  try {
    const testKey = 'health:check';
    await cacheService.set(testKey, { test: true }, 10);
    const result = await cacheService.get(testKey);
    await cacheService.delete(testKey);
    return { status: result ? 'up' : 'down', latency: Date.now() - start };
  } catch (error) {
    return {
      status: 'down',
      latency: Date.now() - start,
      message: error instanceof Error ? error.message : 'Cache check failed',
    };
  }
};

const checkDatabase = async (): Promise<ServiceHealth> => {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'up', latency: Date.now() - start };
  } catch (error) {
    return {
      status: 'down',
      latency: Date.now() - start,
      message: error instanceof Error ? error.message : 'Database check failed',
    };
  }
};

const checkMemory = (): ServiceHealth => {
  const usage = process.memoryUsage();
  const heapUsedPercent = (usage.heapUsed / usage.heapTotal) * 100;

  return {
    status: heapUsedPercent < 90 ? 'up' : 'down',
    message: `Heap usage: ${heapUsedPercent.toFixed(2)}%`,
  };
};

export const healthCheck: RequestHandler = asyncHandler(
  async (_req: Request, res: Response) => {
    const [dbHealth, cacheHealth, memoryHealth] = await Promise.all([
      checkDatabase(),
      checkCache(),
      Promise.resolve(checkMemory()),
    ]);

    const allHealthy = dbHealth.status === 'up' && cacheHealth.status === 'up';
    const anyHealthy = dbHealth.status === 'up' || cacheHealth.status === 'up';

    const status = allHealthy ? 'healthy' : anyHealthy ? 'degraded' : 'unhealthy';

    const health = {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: dbHealth,
        cache: cacheHealth,
        memory: memoryHealth,
      },
      environment: process.env.NODE_ENV || 'development',
    };

    const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;
    res.status(statusCode).json(health);
  },
);
