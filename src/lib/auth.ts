import { cookies } from 'next/headers'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session'

/**
 * Server actions can be invoked directly by action ID, bypassing the /private
 * route proxy, so every private action must call this first.
 */
export async function requireAuth(): Promise<void> {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value

    if (!(await verifySessionToken(token))) {
        throw new Error('Unauthorized')
    }
}
