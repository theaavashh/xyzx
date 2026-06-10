import type { NextFunction, Request, RequestHandler, Response } from 'express';
import morgan from 'morgan';
import { logger } from '../utils/logger';

export const requestLogger = (): RequestHandler => {
  return morgan((tokens, req: Request, res: Response): string => {
    const logData = {
      timestamp: new Date().toISOString(),
      method: tokens.method?.(req, res) ?? req.method,
      url: tokens.url?.(req, res) ?? req.url,
      status: tokens.status?.(req, res) ?? res.statusCode.toString(),
      responseTime: `${tokens['response-time']?.(req, res) ?? 0} ms`,
      contentLength:
        tokens.res?.(req, res, 'content-length') ??
        res.get('content-length') ??
        '0',
      userAgent:
        tokens['user-agent']?.(req, res) ?? req.get('user-agent') ?? 'UNKNOWN',
      remoteAddr: tokens['remote-addr']?.(req, res) ?? req.ip ?? 'UNKNOWN',
      protocol: tokens.protocol?.(req, res) ?? req.protocol,
      userId:
        (req as Request & { user?: { id?: string } }).user?.id ?? 'anonymous',
    };

    return JSON.stringify(logData);
  });
};

export const requestContextMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  (req as Request & { requestId?: string }).requestId = generateRequestId();

  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logEntry = {
      type: 'request',
      requestId: (req as Request & { requestId?: string }).requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      timestamp: new Date().toISOString(),
    };

    if (res.statusCode >= 400) {
      logger.warn('Request completed with error', logEntry);
    } else {
      logger.info('Request completed', logEntry);
    }
  });

  next();
};

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
