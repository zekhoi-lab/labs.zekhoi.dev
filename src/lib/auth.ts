import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session'

/**
 * Server actions can be invoked directly by action ID, bypassing the /private
 * route proxy, so every private action must call this first. Call it outside
 * any try/catch: redirect() works by throwing.
 */
export async function requireAuth(): Promise<void> {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value

    if (!(await verifySessionToken(token))) {
        // Missing or expired session: the client router follows this to the login page
        redirect('/login')
    }
}
