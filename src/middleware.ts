/**
 * 🛡️ MIDDLEWARE SERVER-SIDE
 * 
 * Sistema de proteção de rotas completamente server-side
 * - Verificação de cookie session_id (httpOnly)
 * - Redirecionamentos automáticos baseados em autenticação
 * - Proteção de rotas /admin/* e validação via Redis no AuthContext
 * - Segurança enterprise level
 * 
 * ⚠️ IMPORTANTE:
 * - Middleware apenas verifica SE o cookie existe
 * - Validação da sessão no Redis é feita pelo AuthContext via /api/auth/me
 * - Cookies httpOnly não são acessíveis via JavaScript (segurança contra XSS)
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ✅ Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/auth/login', '/auth/server-login', '/auth/recovery', '/test-pdf', '/webhook-monitor']
  
  // ✅ Rotas de API que não precisam de middleware (tratadas pelos route handlers)
  const apiRoutes = ['/api/auth/session', '/api/auth/me', '/api/auth/logout', '/api/health']
  const isApiRoute = apiRoutes.some(route => pathname.startsWith(route))

  if (isApiRoute) {
    return NextResponse.next()
  }

  // ✅ Obter session ID do cookie (server-side session)
  const sessionId = request.cookies.get('session_id')?.value
  
  // ✅ Verificar se é uma rota pública primeiro
  if (publicRoutes.includes(pathname)) {
    // Se tem sessão ativa e está tentando acessar páginas de auth, redirecionar para dashboard
    // Mas permitir acesso às páginas de teste e webhook-monitor mesmo autenticado
    if (sessionId && (pathname === '/auth/login' || pathname === '/auth/server-login' || pathname === '/auth/recovery')) {
      console.log(`🔄 [Middleware] Usuário autenticado tentando acessar ${pathname}, redirecionando para dashboard`)
      return NextResponse.redirect(new URL('/admin/gerenciador-pdfs', request.url))
    }
    return NextResponse.next()
  }
  
  // ✅ Rotas protegidas que precisam de autenticação
  const protectedRoutes = ['/admin']

  // ✅ Se estiver tentando acessar uma rota protegida sem session ID
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!sessionId) {
      console.log(`🔒 [Middleware] Acesso negado - sem session_id: ${pathname}`)
      return NextResponse.redirect(new URL('/auth/server-login', request.url))
    }
    
    // ✅ Middleware apenas verifica SE o cookie existe
    // A validação da sessão no Redis é feita pelo AuthContext via /api/auth/me
    // Isso evita chamadas síncronas ao Redis no Edge Runtime
  }

  // ✅ Redirecionar raiz para login se não estiver logado, ou gerenciador de PDFs se estiver
  if (pathname === '/') {
    if (sessionId) {
      console.log(`🏠 [Middleware] Usuário autenticado acessando raiz, redirecionando para dashboard`)
      return NextResponse.redirect(new URL('/admin/gerenciador-pdfs', request.url))
    } else {
      console.log(`🏠 [Middleware] Usuário não autenticado acessando raiz, redirecionando para login`)
      return NextResponse.redirect(new URL('/auth/server-login', request.url))
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
