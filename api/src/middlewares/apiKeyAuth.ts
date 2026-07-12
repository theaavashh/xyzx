import { timingSafeEqual } from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

// Correctly extend Express Request
declare global {
  namespace Express {
    interface Request {
      apiKey?: string;
    }
  }
}

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    // Cloak endpoint existence
    if (!apiKey) {
      return res.status(404).end();
    }

    const validApiKeys = process.env.API_KEYS?.split(',') || [];

    const isValid = validApiKeys.some((validKey) => {
      if (validKey.length !== apiKey.length) return false;
      try {
        return timingSafeEqual(Buffer.from(validKey), Buffer.from(apiKey));
      } catch {
        return false;
      }
    });

    if (!isValid) {
      logger.warn('Invalid API key attempt');
      return res.status(404).end();
    }

    req.apiKey = apiKey;
    return next();
  } catch (err) {
    logger.error('API key auth error', undefined, err as Error);
    return res.status(500).end();
  }
};
