import type { Request, Response } from 'express';

export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface LogContext {
  requestId?: string;
  userId?: string;
  endpoint?: string;
  method?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const LOG_LEVELS: Record<LogLevel, number> = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const getLogLevel = (): LogLevel => {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel;
  if (envLevel && LOG_LEVELS[envLevel] !== undefined) {
    return envLevel;
  }
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
};

const currentLevel = getLogLevel();

const isLevelEnabled = (level: LogLevel): boolean => 
  LOG_LEVELS[level] <= LOG_LEVELS[currentLevel];

const formatMessage = (entry: LogEntry): string => {
  const base = `${entry.timestamp} [${entry.level.toUpperCase()}] ${entry.message}`;
  
  if (entry.context?.requestId) {
    return `${base} [req:${entry.context.requestId}]`;
  }
  return base;
};

const shouldColorize = (): boolean => process.env.NODE_ENV !== 'production';

const formatWithColor = (entry: LogEntry): string => {
  const colors: Record<LogLevel, string> = {
    fatal: '\x1b[35m',
    error: '\x1b[31m',
    warn: '\x1b[33m',
    info: '\x1b[32m',
    debug: '\x1b[36m',
    trace: '\x1b[90m',
  };
  
  const reset = '\x1b[0m';
  const color = colors[entry.level];
  const base = `${entry.timestamp} ${color}[${entry.level.toUpperCase()}]${reset} ${entry.message}`;
  
  let output = base;
  
  if (entry.context) {
    const contextStr = JSON.stringify(entry.context);
    output += ` ${contextStr}`;
  }
  
  if (entry.error) {
    output += `\n${entry.error.stack || entry.error.message}`;
  }
  
  return output;
};

const shouldPrettyPrint = (): boolean => process.env.NODE_ENV !== 'production';

const createEntry = (
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: Error,
): LogEntry => ({
  level,
  message,
  timestamp: new Date().toISOString(),
  context,
  error: error
    ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }
    : undefined,
});

const writeLog = (entry: LogEntry): void => {
  if (!isLevelEnabled(entry.level)) return;
  
  if (shouldPrettyPrint() && shouldColorize()) {
    process.stdout.write(formatWithColor(entry) + '\n');
  } else {
    const output = shouldPrettyPrint() 
      ? JSON.stringify(entry, null, 2) 
      : JSON.stringify(entry);
    process.stdout.write(output + '\n');
  }
};

const log = (level: LogLevel, message: string, context?: LogContext, error?: Error): void => {
  const entry = createEntry(level, message, context, error);
  writeLog(entry);
};

export const logger = {
  fatal: (message: string, context?: LogContext, error?: Error) => 
    log('fatal', message, context, error),
  
  error: (message: string, context?: LogContext, error?: Error) => 
    log('error', message, context, error),
  
  warn: (message: string, context?: LogContext) => 
    log('warn', message, context),
  
  info: (message: string, context?: LogContext) => 
    log('info', message, context),
  
  debug: (message: string, context?: LogContext) => 
    log('debug', message, context),
  
  trace: (message: string, context?: LogContext) => 
    log('trace', message, context),
};

export const createRequestLogger = (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestId = (req.headers['x-request-id'] as string) || 
    Math.random().toString(36).substring(2, 15);

  const getResponseBody = () => {
    const originalSend = res.send;
    let body: unknown;
    res.send = function (this: typeof res, data: unknown) {
      body = data;
      return originalSend.call(this, data);
    } as typeof res.send;
    return () => body;
  };
  
  const captureResponse = getResponseBody();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logContext: LogContext = {
      requestId,
      method: req.method,
      endpoint: req.originalUrl,
      ip: req.ip || req.headers['x-forwarded-for'] as string,
      userAgent: req.headers['user-agent'],
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    };

    if (res.statusCode >= 500) {
      logger.error(`${req.method} ${req.originalUrl} ${res.statusCode}`, logContext);
    } else if (res.statusCode >= 400) {
      logger.warn(`${req.method} ${req.originalUrl} ${res.statusCode}`, logContext);
    } else {
      logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, logContext);
    }
  });

  return requestId;
};

export const loggerWithContext = (context: LogContext) => ({
  fatal: (message: string, error?: Error) => logger.fatal(message, context, error),
  error: (message: string, error?: Error) => logger.error(message, context, error),
  warn: (message: string) => logger.warn(message, context),
  info: (message: string) => logger.info(message, context),
  debug: (message: string) => logger.debug(message, context),
  trace: (message: string) => logger.trace(message, context),
});

export default logger;