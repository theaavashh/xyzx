import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtConfig } from '../config/env-config';
import { prisma } from '../lib/database';
import { cacheService } from '../services/cache.service';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role?: string;
        iat?: number;
        exp?: number;
        isActive: boolean;
      };
      apiKey?: string;
    }
  }
}

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    next();
  } catch (error) {
    logger.error('Admin check error', undefined, error as Error);
    return res.status(500).json({
      success: false,
      message: 'Admin access validation error',
    });
  }
};

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required. Use: Authorization: Bearer <token>',
      });
    }

    const token = authHeader!.slice(7);

    const jwtConfig = getJwtConfig();
    const payload = jwt.verify(token, jwtConfig.secret) as unknown as {
      userId: string;
      email: string;
      role?: string;
      iat: number;
      exp: number;
    };

    const blacklistKey = `blacklist:user:${payload.userId}`;
    const invalidatedAt = await cacheService.get<number>(blacklistKey);
    if (invalidatedAt && payload.iat < invalidatedAt) {
      return res.status(401).json({
        success: false,
        message: 'Token has been revoked. Please log in again.',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or deactivated',
      });
    }

    req.user = { ...payload, isActive: user.isActive };

    next();
  } catch (error) {
    logger.error('Authentication error', undefined, error as Error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};
