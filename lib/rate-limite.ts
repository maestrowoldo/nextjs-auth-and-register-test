// lib/rate-limit.ts

import { LRUCache } from 'lru-cache';
import { headers } from 'next/headers';

// Cache em memória para armazenar o número de requisições por IP
const tokenCache = new LRUCache<string, { count: number; ts: number }>({
  max: 5000,       // número máximo de chaves armazenadas
  ttl: 60 * 1000,  // tempo de vida dos registros (1 minuto)
});

/**
 * Função simples de rate limiting baseada em IP.
 * Limita o número de requisições a endpoints sensíveis em um curto intervalo de tempo.
 */
export async function rateLimit(keyPrefix: string, limit = 10) {
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const key = `${keyPrefix}:${ip}`;

  // Recupera ou cria o registro de requisições do IP
  const now = Date.now();
  const entry = tokenCache.get(key) || { count: 0, ts: now };

  entry.count += 1;
  tokenCache.set(key, entry);

  // Calcula o número de tentativas restantes e tempo para reset
  const remaining = Math.max(0, limit - entry.count);
  const reset = 60;

  return {
    success: entry.count <= limit,
    remaining,
    reset,
  };
}

