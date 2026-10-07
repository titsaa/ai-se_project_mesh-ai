const DEFAULT_TTL_MS = 60 * 1000;

const cache = new Map<string, { value: unknown; expiresAt: number }>();

export const getCacheValue = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() >= entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.value as T;
};

export const setCacheValue = <T>(
  key: string,
  value: T,
  ttlMs = DEFAULT_TTL_MS,
) => {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
};

export const deleteCacheValue = (key: string) => {
  cache.delete(key);
};

export const deleteCacheValuesByPrefix = (prefix: string) => {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
};
