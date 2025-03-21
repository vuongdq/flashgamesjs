import { NextResponse } from 'next/server';

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    // Kiểm tra Authorization header thay vì cookie
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Có thể thêm logic verify token ở đây
    const token = authHeader.split(' ')[1];
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid token' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }

  // Chuyển hướng từ /games/[id] sang /game/[slug]
  if (request.nextUrl.pathname.startsWith('/games/')) {
    const gameId = request.nextUrl.pathname.split('/')[2];
    if (/^[0-9a-fA-F]{24}$/.test(gameId)) {
      return NextResponse.redirect(
        new URL(`/api/redirect/${gameId}`, request.url)
      );
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/games/:path*', '/api/admin/:path*']
}; 