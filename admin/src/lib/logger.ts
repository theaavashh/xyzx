'use client';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

const isDev = process.env.NODE_ENV !== 'production';

const log = (level: LogLevel, message: string, context?: Record<string, unknown>) => {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };

  if (isDev) {
    const color = { error: '\x1b[31m', warn: '\x1b[33m', info: '\x1b[32m', debug: '\x1b[36m' }[level];
    const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : level === 'info' ? console.info : console.debug;
    consoleMethod(`${color}[${level.toUpperCase()}]\x1b[0m ${message}`);
    if (context) {
      consoleMethod(`  ${JSON.stringify(context)}`);
    }
  } else {
    if (level === 'error' || level === 'warn') {
      console[level](JSON.stringify(entry));
    }
  }
};

export const clientLogger = {
  error: (message: string, contextOrError?: Record<string, unknown> | unknown) => {
    const ctx: Record<string, unknown> = {};
    if (contextOrError instanceof Error) {
      ctx.error = contextOrError.message;
    } else if (contextOrError && typeof contextOrError === 'object') {
      Object.assign(ctx, contextOrError);
    }
    log('error', message, ctx);
  },
  warn: (message: string, context?: Record<string, unknown>) => log('warn', message, context),
  info: (message: string, context?: Record<string, unknown>) => log('info', message, context),
  debug: (message: string, context?: Record<string, unknown>) => log('debug', message, context),
};
