import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const ADMIN_COOKIE = 'admin_session';
const PUBLIC_PATHS = [
  '/admin/login',
  '/admin/forgot-password',
  '/admin/reset-password'
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only run on /admin routes
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  // Allow login page through without auth
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

  // Check for session cookie
  const session = req.cookies.get(ADMIN_COOKIE);
  if (!session?.value) {
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Validate JWT session
  try {
    const payload = await verifyToken(session.value);
    if (!payload) {
      throw new Error('Invalid token');
    }
    return NextResponse.next();
  } catch (error) {
    const loginUrl = new URL('/admin/login', req.url);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete(ADMIN_COOKIE);
    return res;
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
