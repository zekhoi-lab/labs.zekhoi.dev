import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isDashboard = request.nextUrl.pathname === '/'

  if (isDashboard && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login'],
}
