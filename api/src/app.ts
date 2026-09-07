import crypto from 'crypto';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import path from 'path';
import { Prisma } from '@prisma/client';
import { setupSwagger } from './config/swagger';
import { healthCheck } from './controllers/health.controller';
import { blockBrowserNavigation } from './middlewares/blockBrowserNav';
import { csrfProtection } from './middlewares/csrf';
import { metricsMiddleware, metricsEndpoint } from './middlewares/metrics';
import { requestIdMiddleware } from './middlewares/requestId';
import { logger } from './utils/logger';
import mainRoutes from './routes/main.routes';

const app: Application = express();

app.set('trust proxy', 1);

const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
  : ['http://localhost:3000', 'http://localhost:3001'];

const isProduction = process.env.NODE_ENV === 'production';

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || '300', 10),
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const path = req.path;
    return (
      path.startsWith('/api/v1/public/') ||
      path.startsWith('/uploads/')
    );
  },
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 10,
  delayMs: () => 500,
  skip: (req) => req.path.startsWith('/api/v1/public/') || req.path.startsWith('/uploads/'),
});

const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.PUBLIC_RATE_LIMIT_MAX || '600', 10),
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(compression());

app.use(cookieParser());

app.use(
  cors({
    origin: CORS_ORIGINS,
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-HTTP-Method-Override',
      'X-Request-ID',
      'X-CSRF-Token',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);

app.use(blockBrowserNavigation);

app.use(
  helmet({
    contentSecurityPolicy: isProduction
      ? {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
            scriptSrc: ["'self'", 'https://static.cloudflareinsights.com'],
            scriptSrcElem: ["'self'", 'https://static.cloudflareinsights.com'],
            imgSrc: ["'self'", 'data:', 'https:', 'http:', 'blob:'],
            fontSrc: ["'self'", 'fonts.gstatic.com', 'data:'],
            connectSrc: ["'self'", 'https://*.google-analytics.com', 'https://*.cloudflareinsights.com'],
            frameSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
          },
        }
      : false,
    hidePoweredBy: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    dnsPrefetchControl: { allow: false },
    hsts: isProduction
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }
      : false,
    ieNoOpen: true,
    frameguard: { action: 'deny' },
    xssFilter: true,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginEmbedderPolicy: { policy: 'credentialless' },
  }),
);

app.use(requestIdMiddleware);

app.use(metricsMiddleware);

if (!isProduction) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use('/api/v1/public', publicLimiter);
app.use(globalLimiter);
app.use(speedLimiter);

app.use(hpp());

app.use(
  express.json({
    limit: '10mb',
    strict: true,
    type: 'application/json',
  }),
);

app.use(
  express.urlencoded({
    extended: false,
    limit: '10mb',
    parameterLimit: 100,
  }),
);

const uploadsPath = path.join(__dirname, '..', 'uploads');
app.use(
  '/uploads',
  express.static(uploadsPath, {
    maxAge: '1d',
    etag: true,
    setHeaders: (res, filePath) => {
      res.setHeader('Access-Control-Allow-Origin', CORS_ORIGINS[0] || '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      if (filePath.includes('private') || filePath.includes('temp')) {
        res.setHeader('Cache-Control', 'no-store');
      }
    },
  }),
);

app.use((req: Request, res: Response, next: NextFunction) => {
  if (isProduction && req.headers['x-forwarded-for'] && req.headers['x-forwarded-for'] !== req.ip) {
    const forwardedCount = req.headers['x-forwarded-for']?.toString().split(',').length || 0;
    if (forwardedCount > 4) {
      res.status(400).json({
        success: false,
        message: 'Suspicious request detected',
      });
      return;
    }
  }

  const maliciousAgents = [
    /wget/i,
    /curl/i,
    /python-requests\/[2-9]/i,
    /httpclient/i,
    /scrapy/i,
    /mechanize/i,
    /phantomjs/i,
    /selenium/i,
    /puppeteer/i,
  ];

  const userAgent = req.headers['user-agent'];
  if (userAgent && isProduction) {
    for (const agentRegex of maliciousAgents) {
      if (agentRegex.test(userAgent)) {
        logger.warn('Malicious user agent detected', {
          requestId: req.id,
          userAgent: userAgent.substring(0, 100),
        });
        res.status(403).json({
          success: false,
          message: 'Access denied',
        });
        return;
      }
    }
  }

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  next();
});

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the API server!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.get('/health', healthCheck);
app.get('/metrics', (req: Request, res: Response, next: NextFunction) => {
  const providedKey = (req.headers['x-api-key'] as string) || '';
  const expectedKey = process.env.METRICS_API_KEY || process.env.API_KEY;
  if (expectedKey) {
    if (!providedKey) {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }
    // Use timing-safe comparison to prevent timing attacks
    const expectedBuf = Buffer.from(expectedKey);
    const providedBuf = Buffer.from(providedKey);
    if (expectedBuf.length !== providedBuf.length || !crypto.timingSafeEqual(expectedBuf, providedBuf)) {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }
  }
  next();
}, metricsEndpoint);

setupSwagger(app);

app.use('/api/v1', csrfProtection);

app.use('/api/v1', mainRoutes);

app.use('/api/v1', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

app.all('/*splat', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error', { requestId: req.id, path: req.path }, err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2003':
        return res.status(400).json({
          success: false,
          message: 'Cannot delete this item because it is referenced by other records',
        });
      case 'P2002':
        return res.status(409).json({
          success: false,
          message: 'A record with this value already exists',
        });
      case 'P2025':
        return res.status(404).json({
          success: false,
          message: 'Record not found',
        });
      case 'P2014':
        return res.status(400).json({
          success: false,
          message: 'The change would violate a required relation',
        });
      case 'P2015':
        return res.status(404).json({
          success: false,
          message: 'Related record not found',
        });
      default:
        logger.error('Prisma error', { code: err.code, requestId: req.id });
        return res.status(400).json({
          success: false,
          message: 'Database operation failed',
        });
    }
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    logger.error('Prisma initialization error', { requestId: req.id }, err);
    return res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable',
    });
  }

  return res.status(500).json({
    success: false,
    message: isProduction ? 'Internal server error' : err.message,
  });
});

export default app;