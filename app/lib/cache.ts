import { createClient } from 'redis'

let redisClient: ReturnType<typeof createClient> | null = null

export async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    })

    redisClient.on('error', (err) => {
      console.error('Redis Client Error', err)
    })

    await redisClient.connect()
  }
  return redisClient
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const client = await getRedisClient()
    const data = await client.get(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error getting cached data:', error)
    return null
  }
}

export async function setCachedData(key: string, data: any, ttlSeconds: number = 300) {
  try {
    const client = await getRedisClient()
    await client.setEx(key, ttlSeconds, JSON.stringify(data))
  } catch (error) {
    console.error('Error setting cached data:', error)
  }
}

export async function invalidateCache(key: string) {
  try {
    const client = await getRedisClient()
    await client.del(key)
  } catch (error) {
    console.error('Error invalidating cache:', error)
  }
}