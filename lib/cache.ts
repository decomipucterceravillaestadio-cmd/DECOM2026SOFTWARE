// Simple in-memory cache for public data
// In production, consider using Redis or similar

const cache = new Map<string, { data: any; expires: number }>()

export async function getCachedData(key: string) {
  const item = cache.get(key)
  
  if (!item) {
    return null
  }
  
  // Check if expired
  if (Date.now() > item.expires) {
    cache.delete(key)
    return null
  }
  
  return item.data
}

export async function setCachedData(
  key: string,
  data: any,
  ttlSeconds: number = 300
) {
  const expires = Date.now() + ttlSeconds * 1000
  cache.set(key, { data, expires })
  return true
}

export async function invalidateCache(key: string) {
  cache.delete(key)
  return true
}

export async function invalidateAllCache() {
  cache.clear()
  return true
}
