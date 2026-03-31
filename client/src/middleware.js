import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    
    // 1. Get the dynamic auth token from cookies
    const token = request.cookies.get('auth_token')?.value;

    // 2. Define protected and public path patterns
    const isDashboardPath = pathname.startsWith('/dashboard');
    const isAuthPath = ['/login', '/register', '/forgot-password'].includes(pathname);
    const isRootPath = pathname === '/';

    // ─── AUTHENTICATION GUARD ───

    // CASE A: User is NOT logged in but trying to access Dashboard
    if (isDashboardPath && !token) {
        return NextResponse.redirect(new URL('/login?error=auth_required', request.url));
    }

    // CASE B: User IS already logged in but trying to access Auth/Main pages
    if ((isAuthPath || isRootPath) && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// Optimization: Only run middleware on relevant paths
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public assets (logo, etc)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.svg).*)',
    ],
};
