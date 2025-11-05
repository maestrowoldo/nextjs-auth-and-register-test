import { z } from 'zod';

// Validação de dados para registro de usuário
export const RegisterSchema = z
  .object({
    fullName: z.string().min(3, 'Nome muito curto'),
    email: z.string().email('E-mail inválido').toLowerCase(),
    password: z.string().min(8, 'Mínimo de 8 caracteres'),
    confirmPassword: z.string().min(8),
    csrfToken: z.string().min(10),
  })
  // Garante que as senhas digitadas coincidam
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  });

// Validação de dados para login de usuário
export const LoginSchema = z.object({
  email: z.string().email('E-mail inválido').toLowerCase(),
  password: z.string().min(8, 'Senha inválida'),
  remember: z.boolean().optional(), // campo opcional "lembrar-me"
  csrfToken: z.string().min(10),
});
