export type CacheNamespace =
  | 'agents'
  | 'attendances'
  | 'dashboard-summary'

export type CacheKey = CacheNamespace | `${CacheNamespace}:${string}`

interface CacheEntry<TData> {
  data: TData
  createdAt: number
}

const defaultStaleTimeInMs = 15000
const cache = new Map<CacheKey, CacheEntry<unknown>>()

interface CacheReadOptions {
  force?: boolean
  staleTimeInMs?: number
}

const normalizeCacheValue = (value: unknown): string => {
  if (value === undefined || value === null || value === '') {
    return 'none'
  }

  return String(value)
}

export const createCacheKey = (
  namespace: CacheNamespace,
  params?: Record<string, unknown>,
): CacheKey => {
  if (!params) {
    return namespace
  }

  const serializedParams = Object.entries(params)
    .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey))
    .map(([key, value]) => `${key}=${normalizeCacheValue(value)}`)
    .join('&')

  return `${namespace}:${serializedParams}`
}

export const getCachedData = <TData>(
  key: CacheKey,
  options?: CacheReadOptions,
): TData | null => {
  if (options?.force) {
    return null
  }

  const entry = cache.get(key)

  if (!entry) {
    return null
  }

  const staleTimeInMs = options?.staleTimeInMs ?? defaultStaleTimeInMs
  const isStale = Date.now() - entry.createdAt > staleTimeInMs

  if (isStale) {
    cache.delete(key)

    return null
  }

  return entry.data as TData
}

export const setCachedData = <TData>(key: CacheKey, data: TData): void => {
  cache.set(key, {
    data,
    createdAt: Date.now(),
  })
}

export const invalidateCache = (...keys: CacheKey[]): void => {
  keys.forEach((key) => cache.delete(key))
}

export const invalidateCacheNamespace = (
  ...namespaces: CacheNamespace[]
): void => {
  const namespaceSet = new Set<CacheNamespace>(namespaces)

  Array.from(cache.keys()).forEach((key) => {
    const namespace = key.split(':', 1)[0] as CacheNamespace

    if (namespaceSet.has(namespace)) {
      cache.delete(key)
    }
  })
}

export const clearCache = (): void => {
  cache.clear()
}
