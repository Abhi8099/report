import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const protectedPaths = [

    '/dashboard',
    '/google-console',
    '/analytics',
    '/pages/settings',
    '/pages',
    '/profile',

  ];



  const authPaths = ['/signin', '/signup'];


  const token = request.cookies.get('login_access_token');

  if (protectedPaths.includes(path) && !token) {
    return NextResponse.redirect(new URL('/signin', request.nextUrl));
  }

  if (authPaths.includes(path) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }


  return NextResponse.next();
}

export const config = {
  matcher:  [
    '/',
    '/signin',
    '/dashboard',
    '/google-console',
    '/analytics',
    '/signup',
    '/pages/settings',
    '/pages',
    '/profile',

  ]
};
