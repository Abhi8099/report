
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define protected and auth paths
  const protectedPaths = [
    '/dashboard',
    '/google-console',
    '/analytics',
    '/pages/settings',
    '/pages',
    '/profile',
  ];
  
  const authPaths = ['/signin', '/signup'];

  // Get the JWT token using next-auth
  const tokenFromAuth = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Get the token from cookies
  const tokenFromCookie = request.cookies.get('login_access_token_report');

  // Check if the user has any valid token (JWT or cookie token)
  const isAuthenticated = tokenFromAuth || tokenFromCookie;

  // If the user is not authenticated and trying to access protected paths, redirect to signin
  if (protectedPaths.includes(path) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/signin', request.nextUrl));
  }

  // If the user is authenticated and trying to access auth paths, redirect to dashboard
  if (authPaths.includes(path) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  // Proceed to the next middleware or route handler
  return NextResponse.next();
}

export const config = {
  matcher: [
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
