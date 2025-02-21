import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  
  // URLs completos para redirecionamento
  const loginUrl = new URL('/login', request.url)
  const dashboardUrl = new URL('/dashboard', request.url)
  
  // Adiciona debug para ver o que está acontecendo
  console.log('Middleware executado:', {
    pathname: request.nextUrl.pathname,
    isAuthenticated: !!token,
  })
  
  // Rotas do dashboard são protegidas
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      console.log('Não autenticado, redirecionando para login')
      return NextResponse.redirect(loginUrl)
    }
    console.log('Autenticado, permitindo acesso ao dashboard')
    return NextResponse.next()
  }
  
  // Usuários autenticados são redirecionados para o dashboard nas páginas de autenticação
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && token) {
    console.log('Já autenticado, redirecionando para dashboard')
    return NextResponse.redirect(dashboardUrl)
  }
  
  // Para a rota principal (homepage)
  if (request.nextUrl.pathname === '/') {
    if (token) {
      console.log('Autenticado na homepage, redirecionando para dashboard')
      return NextResponse.redirect(dashboardUrl)
    }
    console.log('Não autenticado na homepage, redirecionando para login')
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

// Configure o matcher para aplicar somente nas rotas necessárias
export const config = {
  matcher: ['/', '/dashboard/:path*', '/login', '/register']
}