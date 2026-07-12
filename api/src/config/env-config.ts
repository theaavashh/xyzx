import dotenv from 'dotenv';

dotenv.config();

export interface AppConfig {
  port: number;
  nodeEnv: string;
  apiUrl: string;
  frontendUrl: string;
  corsOrigins: string[];
}

export interface JwtConfig {
  secret: string;
  refreshSecret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export interface RedisConfig {
  enabled: boolean;
  host: string;
  port: number;
  password: string;
  db: number;
}

export interface CacheConfig {
  ttl: number;
  checkPeriod: number;
  l1CacheSize: number;
  l1CacheTtl: number;
}

export interface StripeConfig {
  secretKey: string;
  webhookSecret: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  resendApiKey: string;
}

export interface MonitoringConfig {
  prometheusEnabled: boolean;
  metricsPort: number;
}

export const getAppConfig = (): AppConfig => ({
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiUrl: process.env.API_URL || 'http://localhost:3001',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3004'],
});

const KNOWN_INSECURE_SECRETS = [
  'default-secret-change-me',
  'default-refresh-secret-change-me',
  'dev-jwt-secret-do-not-use-in-production',
  'dev-jwt-refresh-secret-do-not-use-in-production',
];

export const getJwtConfig = (): JwtConfig => {
  const secret = process.env.JWT_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!secret || KNOWN_INSECURE_SECRETS.includes(secret)) {
    throw new Error(
      'JWT_SECRET environment variable must be set to a unique, secure value',
    );
  }

  if (!refreshSecret || KNOWN_INSECURE_SECRETS.includes(refreshSecret)) {
    throw new Error(
      'JWT_REFRESH_SECRET environment variable must be set to a unique, secure value',
    );
  }

  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }

  if (refreshSecret.length < 32) {
    throw new Error('JWT_REFRESH_SECRET must be at least 32 characters');
  }

  return {
    secret,
    refreshSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  };
};

export const getRedisConfig = (): RedisConfig => ({
  enabled: process.env.USE_REDIS === 'true',
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || '',
  db: parseInt(process.env.REDIS_DB || '0', 10),
});

export const getCacheConfig = (): CacheConfig => ({
  ttl: parseInt(process.env.CACHE_TTL || '600', 10),
  checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD || '60', 10),
  l1CacheSize: parseInt(process.env.L1_CACHE_SIZE || '1000', 10),
  l1CacheTtl: parseInt(process.env.L1_CACHE_TTL || '60', 10),
});

export const getStripeConfig = (): StripeConfig => ({
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
});

export const getEmailConfig = (): EmailConfig => ({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  from: process.env.RESEND_FROM || process.env.SMTP_FROM || 'RaphArch <info@rapharch.com.au>',
  resendApiKey: process.env.RESEND_API_KEY || '',
});

export const getMonitoringConfig = (): MonitoringConfig => ({
  prometheusEnabled: process.env.PROMETHEUS_ENABLED === 'true',
  metricsPort: parseInt(process.env.METRICS_PORT || '9090', 10),
});
