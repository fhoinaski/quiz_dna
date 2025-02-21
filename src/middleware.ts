import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Log para diagnóstico
  console.log('Middleware executado para:', request.nextUrl.pathname)
  
  // Tenta obter o token
  let token: any
  try {
    token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })
    console.log('Token encontrado:', !!token)
  } catch (error) {
    console.error('Erro ao tentar verificar token:', error)
  }
  
  // URLs completos para redirecionamento
  const loginUrl = new URL('/login', request.url)
  const dashboardUrl = new URL('/dashboard', request.url)
  
  // Verificações para rotas específicas
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      console.log('Não autenticado, redirecionando para login')
      return NextResponse.redirect(loginUrl)
    }
    console.log('Autenticado para dashboard, permitindo acesso')
    return NextResponse.next()
  }
  
  // Redirecionamento para usuários autenticados em páginas de autenticação
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && token) {
    console.log('Autenticado em página de login/registro, redirecionando para dashboard')
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