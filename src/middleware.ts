import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
 

export async function middleware(request: NextRequest) {

const token = await getToken({req: request})
const url = request.nextUrl

if(token && (
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up')
) ){
      return NextResponse.redirect(new URL('/', request.url))


}

 if(!token && (
  url.pathname.startsWith('/profile') ||
  url.pathname.startsWith('/upload')
 )){
  return NextResponse.redirect(new URL('/sign-in', request.url))
 }

  return NextResponse.next();
}
 

export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/profile',
    '/upload'
  ]
}

