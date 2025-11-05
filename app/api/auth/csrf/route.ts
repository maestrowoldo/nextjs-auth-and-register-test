// app/api/auth/csrf/route.ts
import { NextResponse } from 'next/server';
import { generateCsrfToken } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  // Gera um novo token CSRF assinado
  const token = generateCsrfToken();

  // Retorna o token em formato JSON e define o cookie correspondente
  const res = NextResponse.json({ ok: true, csrfToken: token });

  // Configura o cookie CSRF (não httpOnly para leitura no client)
  res.cookies.set('csrf', token, {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 2, // expira em 2 horas
  });

  return res;
}
