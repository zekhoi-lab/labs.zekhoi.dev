import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session'

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Protect all routes starting with /private
    if (pathname.startsWith('/private')) {
        const authToken = request.cookies.get(SESSION_COOKIE)?.value

        if (!(await verifySessionToken(authToken))) {
            const loginUrl = new URL('/login', request.url)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/private/:path*'],
}
