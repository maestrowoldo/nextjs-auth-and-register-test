// app/api/auth/login/route.ts
// Rota de login compatível com Next.js 14+
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { LoginSchema } from '@/lib/validation';
import {
  setAuthCookie,
  signToken,
  verifyPassword,
  validateCsrfDoubleSubmit,
} from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limite';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  // Aplica limite de tentativas de login por IP (rate limit)
  const rl = await rateLimit('login', 10);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente em 1 minuto.' },
      { status: 429 }
    );
  }

  try {
    const data = await req.json();

    // Obtém tokens CSRF do corpo e do cookie
    const c = await cookies();
    const bodyToken = data?.csrfToken as string | undefined;
    const cookieToken = c.get('csrf')?.value;

    // Valida proteção contra CSRF
    if (!validateCsrfDoubleSubmit(bodyToken, cookieToken)) {
      return NextResponse.json({ error: 'CSRF token inválido.' }, { status: 400 });
    }

    // Validação de dados com Zod
    const parsed = LoginSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { email, password, remember } = parsed.data;

    // Busca usuário pelo e-mail no banco de dados
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'E-mail ou senha inválidos.' }, { status: 401 });
    }

    // Verifica se a senha informada é válida
    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'E-mail ou senha inválidos.' }, { status: 401 });
    }

    // Gera token JWT e define cookie de autenticação
    const token = signToken(
      { sub: String(user.id), email: user.email, fullName: user.fullName },
      remember
    );
    setAuthCookie(token, remember);

    return NextResponse.json({ ok: true, message: 'Login efetuado com sucesso!' });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    return NextResponse.json({ error: 'Erro interno ao autenticar.' }, { status: 500 });
  }
}
