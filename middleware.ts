export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Middleware responsável por proteger rotas específicas
export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  // Aplica a verificação apenas nas rotas do dashboard
  if (url.pathname.startsWith('/dashboard')) {
    const token = req.cookies.get('auth')?.value;

    // Redireciona o usuário para login se não houver token ou se for inválido
    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  // Permite a requisição continuar normalmente
  return NextResponse.next();
}

// Define em quais rotas o middleware será executado
export const config = {
  matcher: ['/dashboard/:path*'],
};
