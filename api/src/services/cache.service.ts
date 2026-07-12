import Redis from 'ioredis';
import { logger } from '../utils/logger';

export interface CacheOptions {
  ttl?: number;
  host?: string;
  port?: number;
  password?: string;
  db?: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  keys: number;
}

export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  keys(pattern?: string): Promise<string[]>;
  invalidatePattern(pattern: string): Promise<number>;
  getOrSet<T>(key: string, factory: () => Promise<T>, ttl?: number): Promise<T>;
  getStats(): Promise<CacheStats>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
}

const getRedisConfig = (options: CacheOptions = {}) => ({
  host: options.host ?? process.env.REDIS_HOST ?? 'localhost',
  port: options.port ?? parseInt(process.env.REDIS_PORT ?? '6379', 10),
  db: options.db ?? parseInt(process.env.REDIS_DB ?? '0', 10),
  password: options.password ?? process.env.REDIS_PASSWORD ?? undefined,
  retryStrategy: (times: number) => {
    if (times > 3) {
      logger.warn('Redis connection failed, falling back to no-cache mode', {
        attempt: times,
      });
      return null;
    }
    return Math.min(times * 100, 3000);
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
  connectTimeout: 10000,
  commandTimeout: 5000,
});

const createRedisClient = (options: CacheOptions = {}): Redis => {
  const config = getRedisConfig(options);
  const client = new Redis(config);

  client.on('error', (err) => {
    logger.error('Redis error', { error: err.message });
  });

  client.on('connect', () => {
    logger.info('Redis client connected');
  });

  client.on('ready', () => {
    logger.info('Redis client ready');
  });

  client.on('close', () => {
    logger.warn('Redis connection closed');
  });

  client.on('reconnecting', () => {
    logger.debug('Redis reconnecting...');
  });

  return client;
};

export const createRedisCacheService = (options: CacheOptions = {}): ICacheService => {
  const defaultTtl = options.ttl ?? 600;
  const stats = { hits: 0, misses: 0 };
  let client: Redis | null = null;
  let connected = false;

  const memoryStore = new Map<string, { value: string; expiry?: number }>();

  const memorySet = (key: string, value: string, ttl?: number): void => {
    const expiry = ttl
      ? Date.now() + ttl * 1000
      : defaultTtl > 0
        ? Date.now() + defaultTtl * 1000
        : undefined;
    memoryStore.set(key, { value, expiry });
  };

  const memoryGet = <T>(key: string): T | null => {
    const data = memoryStore.get(key);
    if (!data) return null;
    if (data.expiry && data.expiry < Date.now()) {
      memoryStore.delete(key);
      return null;
    }
    return JSON.parse(data.value) as T;
  };

  const memoryDel = (key: string): void => {
    memoryStore.delete(key);
  };

  const connect = async (): Promise<void> => {
    if (connected) return;
    
    try {
      client = createRedisClient(options);
      await client.connect();
      connected = true;
      logger.info('Redis cache service connected', {
        host: options.host ?? process.env.REDIS_HOST ?? 'localhost',
        port: options.port ?? parseInt(process.env.REDIS_PORT ?? '6379', 10),
      });
    } catch (error) {
      logger.error('Failed to connect Redis cache service, falling back to in-memory cache', undefined, error as Error);
      connected = false;
    }
  };

  const getClient = (): Redis => {
    if (!client) {
      throw new Error('Redis client not initialized. Call connect() first.');
    }
    return client;
  };

  const get = async <T>(key: string): Promise<T | null> => {
    if (!connected) {
      stats.misses++;
      const cached = memoryGet<T>(key);
      if (cached !== null) stats.hits++;
      return cached;
    }
    
    try {
      const data = await getClient().get(key);
      if (data) {
        stats.hits++;
        return JSON.parse(data) as T;
      }
      stats.misses++;
      return null;
    } catch (error) {
      stats.misses++;
      logger.warn('Redis get failed, falling back to in-memory cache', { key, error: (error as Error).message });
      const cached = memoryGet<T>(key);
      if (cached !== null) stats.hits++;
      return cached;
    }
  };

  const set = async <T>(key: string, value: T, ttl?: number): Promise<void> => {
    const serialized = JSON.stringify(value);
    const expiry = ttl ?? defaultTtl;

    memorySet(key, serialized, expiry);

    if (!connected) return;
    
    try {
      await getClient().setex(key, expiry, serialized);
    } catch (error) {
      logger.warn('Redis set failed, using in-memory cache', { key, error: (error as Error).message });
    }
  };

  const del = async (key: string): Promise<void> => {
    memoryDel(key);

    if (!connected) return;
    
    try {
      await getClient().del(key);
    } catch (error) {
      logger.debug('Cache delete error', { key, error: (error as Error).message });
    }
  };

  const clear = async (): Promise<void> => {
    memoryStore.clear();
    stats.hits = 0;
    stats.misses = 0;
    
    if (!connected) return;
    
    try {
      await getClient().flushdb();
    } catch (error) {
      logger.error('Cache clear error', undefined, error as Error);
    }
  };

  const has = async (key: string): Promise<boolean> => {
    if (!connected) {
      return memoryStore.has(key);
    }
    
    try {
      const exists = await getClient().exists(key);
      return exists === 1 || memoryStore.has(key);
    } catch {
      return memoryStore.has(key);
    }
  };

  const keys = async (pattern: string = '*'): Promise<string[]> => {
    const memKeys = Array.from(memoryStore.keys());
    
    if (!connected) return memKeys;
    
    try {
      const redisKeys = await getClient().keys(pattern);
      return [...new Set([...redisKeys, ...memKeys])];
    } catch {
      return memKeys;
    }
  };

  const invalidatePattern = async (pattern: string): Promise<number> => {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    let count = 0;
    for (const key of memoryStore.keys()) {
      if (regex.test(key)) {
        memoryStore.delete(key);
        count++;
      }
    }

    if (!connected) return count;
    
    try {
      const allKeys = await getClient().keys(pattern);
      if (allKeys.length > 0) {
        await getClient().del(...allKeys);
      }
      return allKeys.length + count;
    } catch {
      return count;
    }
  };

  const getOrSet = async <T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number,
  ): Promise<T> => {
    const cached = await get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await set(key, value, ttl);
    return value;
  };

  const getStats = async (): Promise<CacheStats> => {
    const totalKeys = memoryStore.size;
    if (!connected || !client) {
      return { hits: stats.hits, misses: stats.misses, keys: totalKeys };
    }
    
    try {
      const keyCount = await client.dbsize();
      return {
        hits: stats.hits,
        misses: stats.misses,
        keys: Math.max(keyCount, totalKeys),
      };
    } catch {
      return { hits: stats.hits, misses: stats.misses, keys: totalKeys };
    }
  };

  const disconnect = async (): Promise<void> => {
    memoryStore.clear();
    if (client) {
      await client.quit();
      client = null;
      connected = false;
    }
  };

  return {
    get,
    set,
    delete: del,
    clear,
    has,
    keys,
    invalidatePattern,
    getOrSet,
    getStats,
    connect,
    disconnect,
    isConnected: () => connected || memoryStore.size > 0,
  };
};

export const createInMemoryCacheService = (options: CacheOptions = {}): ICacheService => {
  const store = new Map<string, { value: string; expiry?: number }>();
  const stats = { hits: 0, misses: 0 };
  const defaultTtl = options.ttl ?? 600;
  let cleanupInterval: NodeJS.Timeout | null = null;

  const cleanup = (): void => {
    const now = Date.now();
    for (const [key, data] of store.entries()) {
      if (data.expiry && data.expiry < now) {
        store.delete(key);
      }
    }
  };

  const startCleanup = () => {
    if (cleanupInterval) return;
    cleanupInterval = setInterval(cleanup, 60000);
    cleanupInterval.unref();
  };

  const get = async <T>(key: string): Promise<T | null> => {
    const data = store.get(key);
    if (!data) {
      stats.misses++;
      return null;
    }

    if (data.expiry && data.expiry < Date.now()) {
      store.delete(key);
      stats.misses++;
      return null;
    }

    stats.hits++;
    return JSON.parse(data.value) as T;
  };

  const set = async <T>(key: string, value: T, ttl?: number): Promise<void> => {
    const expiry = ttl
      ? Date.now() + ttl * 1000
      : defaultTtl > 0
        ? Date.now() + defaultTtl * 1000
        : undefined;

    store.set(key, { value: JSON.stringify(value), expiry });
    startCleanup();
  };

  const del = async (key: string): Promise<void> => {
    store.delete(key);
  };

  const clear = async (): Promise<void> => {
    store.clear();
    stats.hits = 0;
    stats.misses = 0;
  };

  const has = async (key: string): Promise<boolean> => {
    const data = store.get(key);
    if (!data) return false;
    if (data.expiry && data.expiry < Date.now()) {
      store.delete(key);
      return false;
    }
    return true;
  };

  const keys = async (pattern: string = '*'): Promise<string[]> => {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return Array.from(store.keys()).filter((key) => regex.test(key));
  };

  const invalidatePattern = async (pattern: string): Promise<number> => {
    const keysToDelete = await keys(pattern);
    for (const key of keysToDelete) {
      store.delete(key);
    }
    return keysToDelete.length;
  };

  const getOrSet = async <T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number,
  ): Promise<T> => {
    const cached = await get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await set(key, value, ttl);
    return value;
  };

  const getStats = async (): Promise<CacheStats> => ({
    hits: stats.hits,
    misses: stats.misses,
    keys: store.size,
  });

  const connect = async (): Promise<void> => {
    startCleanup();
    logger.info('In-memory cache service initialized');
  };

  const disconnect = async (): Promise<void> => {
    if (cleanupInterval) {
      clearInterval(cleanupInterval);
      cleanupInterval = null;
    }
    store.clear();
  };

  return {
    get,
    set,
    delete: del,
    clear,
    has,
    keys,
    invalidatePattern,
    getOrSet,
    getStats,
    connect,
    disconnect,
    isConnected: () => true,
  };
};

const useRedis = process.env.USE_REDIS === 'true';

export const cacheService: ICacheService = useRedis
  ? createRedisCacheService()
  : createInMemoryCacheService();

export const initializeCache = async (): Promise<void> => {
  await cacheService.connect();
  logger.info('Cache service initialized', { 
    type: useRedis ? 'redis' : 'memory',
  });
};

export const closeCache = async (): Promise<void> => {
  await cacheService.disconnect();
  logger.info('Cache service disconnected');
};

export const redisCacheService = createRedisCacheService;
export const inMemoryCacheService = createInMemoryCacheService;