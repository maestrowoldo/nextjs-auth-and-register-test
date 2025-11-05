// app/api/auth/register/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { RegisterSchema } from '@/lib/validation';
import { hashPassword, validateCsrfDoubleSubmit } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limite';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  // Limita 10 requisições por IP por minuto (protege contra spam)
  const rl = await rateLimit('register', 10);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente em 1 minuto.' },
      { status: 429 }
    );
  }

  try {
    const data = await req.json();

    // Validação CSRF — garante que a requisição partiu do cliente legítimo
    const bodyToken = data?.csrfToken as string | undefined;
    const c = await cookies();
    const cookieToken = c.get('csrf')?.value;
    if (!validateCsrfDoubleSubmit(bodyToken, cookieToken)) {
      return NextResponse.json({ error: 'CSRF token inválido.' }, { status: 400 });
    }

    // Validação de campos com Zod
    const parsed = RegisterSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { fullName, email, password } = parsed.data;

    // Verifica se o e-mail já está cadastrado
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 409 });
    }

    // Gera o hash seguro da senha
    const passwordHash = await hashPassword(password);

    // Cria o novo usuário no banco de dados
    await prisma.user.create({
      data: { fullName, email, password: passwordHash },
    });

    // Retorna resposta de sucesso
    return NextResponse.json({
      ok: true,
      message: 'Registro efetuado com sucesso! Redirecionando para login...',
    });
  } catch (err) {
    console.error('[REGISTER ERROR]', err);
    return NextResponse.json({ error: 'Erro interno ao registrar.' }, { status: 500 });
  }
}
