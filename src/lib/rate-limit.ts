type RateLimitRecord = {
  count: number
  expiresAt: number
}

const RATE_LIMIT_WINDOW = 60 * 15 * 1000 // 15 minutes
const MAX_ATTEMPTS = 10

class RateLimiter {
  private static instance: RateLimiter
  private storage: Map<string, RateLimitRecord> = new Map()

  private constructor() {}

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter()
    }
    return RateLimiter.instance
  }

  public check(ip: string): { success: boolean; count: number } {
    const now = Date.now()
    const record = this.storage.get(ip)

    if (!record) {
      return { success: true, count: 0 }
    }

    if (now > record.expiresAt) {
      this.storage.delete(ip)
      return { success: true, count: 0 }
    }

    if (record.count >= MAX_ATTEMPTS) {
      return { success: false, count: record.count }
    }

    return { success: true, count: record.count }
  }

  public increment(ip: string): number {
    const now = Date.now()
    const record = this.storage.get(ip)

    if (!record || now > record.expiresAt) {
      this.storage.set(ip, {
        count: 1,
        expiresAt: now + RATE_LIMIT_WINDOW,
      })
      return 1
    }

    record.count++
    return record.count
  }

  public reset(ip: string): void {
    this.storage.delete(ip)
  }
}

export const rateLimiter = RateLimiter.getInstance()
