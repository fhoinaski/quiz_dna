import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')

  // Redireciona usuários autenticados da página de login para o dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protege rotas do dashboard
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Protege rotas da API (exceto resultados públicos e auth)
  if (isApiRoute && !token && !request.nextUrl.pathname.includes('/auth')) {
    if (!request.nextUrl.pathname.match(/\/api\/quiz\/[^/]+\/results/)) {
      return NextResponse.json(
        { error: 'Não autorizado' }, 
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
    '/api/:path*'
  ]
}