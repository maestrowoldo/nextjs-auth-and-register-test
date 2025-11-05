import { PrismaClient } from '@prisma/client';

// Usa uma variável global para evitar múltiplas instâncias do Prisma durante o hot reload no modo dev
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Cria (ou reutiliza) a instância do Prisma Client
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Armazena a instância global para reaproveitar entre reloads durante o desenvolvimento
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
