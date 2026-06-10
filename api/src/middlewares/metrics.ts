import type { NextFunction, Request, Response } from 'express';
import client from 'prom-client';

const register = new client.Registry();

client.collectDefaultMetrics({ register });

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code', 'cache_hit'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

export const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const cacheHitRate = new client.Gauge({
  name: 'cache_hit_rate',
  help: 'Cache hit rate',
  labelNames: ['cache_type'],
  registers: [register],
});

export const cacheHitsTotal = new client.Counter({
  name: 'cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['cache_level'],
  registers: [register],
});

export const cacheMissesTotal = new client.Counter({
  name: 'cache_misses_total',
  help: 'Total number of cache misses',
  registers: [register],
});

export const dbQueryDuration = new client.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Database query duration in seconds',
  labelNames: ['operation', 'model'],
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
  registers: [register],
});

export const dbQueryTotal = new client.Counter({
  name: 'db_queries_total',
  help: 'Total number of database queries',
  labelNames: ['operation', 'model', 'status'],
  registers: [register],
});

export const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  labelNames: ['type'],
  registers: [register],
});

export const memoryUsageBytes = new client.Gauge({
  name: 'memory_usage_bytes',
  help: 'Memory usage in bytes',
  labelNames: ['type'],
  registers: [register],
});

export const businessMetrics = new client.Counter({
  name: 'business_operations_total',
  help: 'Total business operations',
  labelNames: ['operation', 'status'],
  registers: [register],
});

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const startTime = Date.now();
  const cacheHit = (req as Request & { cacheHit?: boolean }).cacheHit ?? false;

  res.on('finish', () => {
    const duration = (Date.now() - startTime) / 1000;
    const route = req.route?.path || req.path;

    httpRequestDuration.observe(
      {
        method: req.method,
        route: route,
        status_code: res.statusCode.toString(),
        cache_hit: cacheHit.toString(),
      },
      duration,
    );

    httpRequestTotal.inc({
      method: req.method,
      route: route,
      status_code: res.statusCode.toString(),
    });
  });

  next();
};

export const cacheMetricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const originalJson = res.json.bind(res);

  res.json = (data: unknown) => {
    if (typeof data === 'object' && data !== null) {
      const response = data as Record<string, unknown>;

      if ('cacheHit' in response) {
        (req as Request & { cacheHit?: boolean }).cacheHit = Boolean(
          response.cacheHit,
        );
      }
    }

    return originalJson(data);
  };

  next();
};

export const dbMetricsMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startQueryTime = Date.now();

    next();
  };
};

export const recordCacheHit = (level: 'l1' | 'l2'): void => {
  cacheHitsTotal.inc({ cache_level: level });

  if (level === 'l1') {
    cacheHitRate.set({ cache_type: 'l1' }, 1);
  } else {
    cacheHitRate.set({ cache_type: 'l2' }, 1);
  }
};

export const recordCacheMiss = (): void => {
  cacheMissesTotal.inc();
};

export const recordDbQuery = (
  operation: string,
  model: string,
  duration: number,
  success: boolean,
): void => {
  dbQueryDuration.observe({ operation, model }, duration / 1000);

  dbQueryTotal.inc({
    operation,
    model,
    status: success ? 'success' : 'error',
  });
};

export const recordBusinessOperation = (
  operation: string,
  success: boolean,
): void => {
  businessMetrics.inc({
    operation,
    status: success ? 'success' : 'error',
  });
};

export const updateMemoryMetrics = (): void => {
  const usage = process.memoryUsage();

  memoryUsageBytes.set({ type: 'heap_used' }, usage.heapUsed);
  memoryUsageBytes.set({ type: 'heap_total' }, usage.heapTotal);
  memoryUsageBytes.set({ type: 'rss' }, usage.rss);
  memoryUsageBytes.set({ type: 'external' }, usage.external);
};

setInterval(updateMemoryMetrics, 30000);

export const metricsEndpoint = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end();
  }
};

export { register as metricsRegister };
