import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/auth/login', '/auth/recovery', '/test-pdf']
  
  // Verificar se é uma rota pública primeiro
  if (publicRoutes.includes(pathname)) {
    // Se estiver logado e tentando acessar login/recovery, redirecionar para dashboard
    // Mas permitir acesso à página de teste
    if (token && pathname !== '/test-pdf') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    return NextResponse.next()
  }
  
  // Rotas protegidas que precisam de autenticação
  const protectedRoutes = ['/admin']

  // Se estiver tentando acessar uma rota protegida sem token
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Redirecionar raiz para login se não estiver logado, ou dashboard se estiver
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
