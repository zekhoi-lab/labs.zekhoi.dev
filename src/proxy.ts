import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Protect all routes starting with /private
    if (pathname.startsWith('/private')) {
        const authToken = request.cookies.get('auth_token')

        if (!authToken || authToken.value !== 'valid_token') {
            const loginUrl = new URL('/login', request.url)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/private/:path*'],
}
