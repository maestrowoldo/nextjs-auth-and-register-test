// lib/auth.ts

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import crypto from 'node:crypto';

const JWT_SECRET = process.env.JWT_SECRET!;
const CSRF_SECRET = process.env.CSRF_SECRET!;

// -------------------------
// Funções de senha (hash e verificação)
// -------------------------
export async function hashPassword(plain: string) {
  // Gera o hash da senha com custo 10 (bom equilíbrio entre segurança e desempenho)
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain: string, hash: string) {
  // Compara a senha informada com o hash armazenado
  return bcrypt.compare(plain, hash);
}

// -------------------------
// JWT (autenticação baseada em token)
// -------------------------
export type JwtPayload = { sub: string; email: string; fullName: string };

export function signToken(payload: JwtPayload, remember?: boolean) {
  // Gera o token JWT com expiração de 1 ou 30 dias
  const expiresIn = remember ? '30d' : '1d';
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): JwtPayload | null {
  // Verifica e decodifica o token JWT; retorna null se inválido
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

// -------------------------
// Cookies de autenticação
// -------------------------
export async function setAuthCookie(token: string, remember?: boolean) {
  // Define o cookie de autenticação (httpOnly, seguro e com duração variável)
  const c = await cookies();
  c.set('auth', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}), // 30 dias se "lembrar-me"
  });
}

export async function clearAuthCookie() {
  // Remove o cookie de autenticação
  const c = await cookies();
  c.set('auth', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

// -------------------------
// CSRF (double-submit token)
// -------------------------
export function generateCsrfToken() {
  // Gera token CSRF com assinatura HMAC (nonce + timestamp)
  const nonce = crypto.randomBytes(16).toString('hex');
  const ts = Date.now();
  const base = `${nonce}.${ts}`;
  const sig = crypto.createHmac('sha256', CSRF_SECRET).update(base).digest('hex');
  return `${base}.${sig}`;
}

export async function setCsrfCookie(token: string) {
  // Define o cookie CSRF (não httpOnly, pois o cliente precisa lê-lo)
  const c = await cookies();
  c.set('csrf', token, {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 2, // 2 horas
  });
}

export function validateCsrfDoubleSubmit(
  bodyToken: string | undefined,
  cookieToken: string | undefined
): boolean {
  // Valida o token CSRF enviado no corpo e no cookie
  if (!bodyToken || !cookieToken) return false;
  if (bodyToken !== cookieToken) return false;

  const [nonce, ts, sig] = cookieToken.split('.');
  if (!nonce || !ts || !sig) return false;

  const base = `${nonce}.${ts}`;
  const expected = crypto.createHmac('sha256', CSRF_SECRET).update(base).digest('hex');
  if (sig !== expected) return false;

  // Verifica expiração (máx. 2h)
  const ageMs = Date.now() - Number(ts);
  return ageMs < 2 * 60 * 60 * 1000;
}
