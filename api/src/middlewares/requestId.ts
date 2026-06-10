import type { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      id: string;
      requestStartTime?: number;
    }
  }
}

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const existingId = req.headers['x-request-id'] as string | undefined;
  
  req.id = existingId || uuidv4();
  req.requestStartTime = Date.now();

  res.setHeader('X-Request-ID', req.id);

  next();
};

export const requestTimingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    
    res.setHeader('X-Response-Time', `${durationMs.toFixed(2)}ms`);
    
    if (durationMs > 1000) {
      logger.warn('Slow request detected', { method: req.method, path: req.path, durationMs });
    }
  });

  next();
};

export const requestLogMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const requestId = req.id;
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.headers['x-forwarded-for'];
  const userAgent = req.headers['user-agent'];

  const log = `[${timestamp}] ${requestId} ${method} ${url} - ${ip} - ${userAgent}`;

  if (process.env.NODE_ENV !== 'test') {
    process.stdout.write(log + '\n');
  }

  next();
};

export const addRequestIdHeader = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.setHeader('X-Request-ID', req.id);
  next();
};