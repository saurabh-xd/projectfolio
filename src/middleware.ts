import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get token with explicit secret
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Protected routes
  const protectedRoutes = ['/profile', '/upload']
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Auth routes
  const authRoutes = ['/sign-in', '/sign-up']
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )

  // If trying to access protected route without auth
  if (isProtectedRoute && !token) {
    const url = new URL('/sign-in', request.url)
    url.searchParams.set('callbackUrl', pathname) // ✅ Save where they wanted to go
    return NextResponse.redirect(url)
  }

  // If trying to access auth routes while authenticated
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up', 
    '/profile/:path*',
    '/upload/:path*'
  ]
}