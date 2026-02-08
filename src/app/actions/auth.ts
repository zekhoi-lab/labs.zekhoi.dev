'use server'

import { cookies } from 'next/headers'
import { headers } from 'next/headers'
// import { redirect } from 'next/navigation'
import { rateLimiter } from '@/lib/rate-limit'

export async function login(password: string) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || '127.0.0.1'
  
  const limitCheck = rateLimiter.check(ip)

  if (!limitCheck.success) {
    return { success: false, error: 'limit' }
  }

  // Simulate network delay for "loading" state effect
  await new Promise((resolve) => setTimeout(resolve, 1500))

  if (password === process.env.AUTH_PASSWORD) {
    rateLimiter.reset(ip)
    const cookieStore = await cookies()
    cookieStore.set('auth_token', 'valid_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    return { success: true }
  }

  // Increment attempts on failure
  const newAttempts = rateLimiter.increment(ip)

  return { success: false, attempts: newAttempts }
}


