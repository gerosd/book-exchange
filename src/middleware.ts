import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('user-session');
  const { pathname } = request.nextUrl;

  // Защищенные маршруты для авторизованных пользователей
  const protectedRoutes = ['/dashboard', '/create-application'];
  
  // Маршруты только для администраторов
  const adminRoutes = ['/admin'];

  // Маршруты только для неавторизованных пользователей
  const guestRoutes = ['/login', '/register'];

  let user = null;
  if (sessionCookie) {
    try {
      user = JSON.parse(sessionCookie.value);
    } catch {
      // Если cookie поврежден, удаляем его
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('user-session');
      return response;
    }
  }

  // Проверяем маршруты для неавторизованных пользователей
  if (guestRoutes.includes(pathname) && user) {
    return NextResponse.redirect(new URL(user.isAdmin ? '/admin' : '/dashboard', request.url));
  }

  // Проверяем защищенные маршруты
  if (protectedRoutes.includes(pathname) && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Проверяем админские маршруты
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (!user.isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/create-application/:path*',
    '/admin/:path*',
    '/login',
    '/register'
  ]
};


