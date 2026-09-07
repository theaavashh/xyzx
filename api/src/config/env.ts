import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  GRPC_PORT: z.string().default('50051'),
  
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().default('0'),
  USE_REDIS: z.string().default('false'),
  
  CORS_ORIGINS: z.string().optional(),
  FRONTEND_URL: z.string().url().optional(),
  ADMIN_URL: z.string().url().optional(),
  
  RATE_LIMIT_MAX: z.string().default('200'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  
  SENTRY_DSN: z.string().url().optional(),
  
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM: z.string().optional(),
  
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).optional(),
  
  DB_POOL_MIN: z.string().default('2'),
  DB_POOL_MAX: z.string().default('10'),
  DB_POOL_TIMEOUT: z.string().default('30000'),
  DB_POOL_IDLE_TIMEOUT: z.string().default('10000'),
});

export type EnvConfig = z.infer<typeof envSchema>;

let envCache: EnvConfig | null = null;

export const validateEnv = (): EnvConfig => {
  if (envCache) return envCache;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`,
    );
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }

  envCache = result.data;
  return envCache;
};

export const getEnv = (): EnvConfig => {
  return validateEnv();
};

export const isProduction = (): boolean => process.env.NODE_ENV === 'production';
export const isDevelopment = (): boolean => process.env.NODE_ENV === 'development';
export const isTest = (): boolean => process.env.NODE_ENV === 'test';