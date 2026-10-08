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

export const CACHE_SERVICE_TOKEN = 'CACHE_SERVICE';