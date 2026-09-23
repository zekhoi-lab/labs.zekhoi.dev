'use server'

import { createHash, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { headers } from 'next/headers'
// import { redirect } from 'next/navigation'
import { rateLimiter } from '@/lib/rate-limit'
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken } from '@/lib/session'

function getClientIp(headersList: Headers): string {
  // x-real-ip is set by the platform/reverse proxy; x-forwarded-for can be
  // appended to by the client, so only its first entry is used as a fallback.
  const realIp = headersList.get('x-real-ip')
  if (realIp) return realIp.trim()

  const forwarded = headersList.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()

  return '127.0.0.1'
}

function passwordMatches(input: string): boolean {
  const expected = process.env.AUTH_PASSWORD
  if (!expected) return false

  // Hash both sides so timingSafeEqual gets equal-length buffers
  const a = createHash('sha256').update(input).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}

export async function login(password: string) {
  const headersList = await headers()
  const ip = getClientIp(headersList)

  const limitCheck = rateLimiter.check(ip)

  if (!limitCheck.success) {
    return { success: false, error: 'limit' }
  }

  // Simulate network delay for "loading" state effect
  await new Promise((resolve) => setTimeout(resolve, 1500))

  if (typeof password === 'string' && passwordMatches(password)) {
    rateLimiter.reset(ip)
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, await createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })
    return { success: true }
  }

  // Increment attempts on failure
  const newAttempts = rateLimiter.increment(ip)

  return { success: false, attempts: newAttempts }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
