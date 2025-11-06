'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { RegisterSchema } from '@/lib/validation';

// Função para buscar token CSRF
async function fetchCsrfToken() {
  const res = await fetch('/api/auth/csrf');
  const data = await res.json();
  return data.csrfToken || '';
}

export default function RegisterPage() {
  const router = useRouter();
  const [csrf, setCsrf] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCsrfToken().then(setCsrf);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    const parsed = RegisterSchema.safeParse({ ...form, csrfToken: csrf });
    if (!parsed.success) {
      setMsg('Verifique os campos e tente novamente.');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, csrfToken: csrf }),
    });

    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error || 'Erro ao registrar.');
      setLoading(false);
      return;
    }

    setMsg('Conta criada com sucesso!');
    setTimeout(() => router.push('/auth/login'), 1000);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-8">
      {/* Card principal */}
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl p-10 sm:p-14 flex flex-col items-center text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/logo-Affinity-Secure.png"
            alt="Affinity Secure Logo"
            width={120}
            height={120}
            className="drop-shadow-sm"
          />
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Affinity Secure
        </h1>
        <p className="text-gray-600 text-base mb-10">
          Crie sua conta e comece a usar o sistema
        </p>

        {/* Formulário */}
        <div className="max-w-md mx-auto">
          {msg && (
            <p
              className={`text-center text-sm mb-4 ${
                msg.includes('sucesso') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {msg}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              placeholder="Nome completo"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />

            <input
              type="email"
              placeholder="E-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />

            <input
              type="password"
              placeholder="Senha"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />

            <input
              type="password"
              placeholder="Confirmar senha"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />

            <button
              disabled={loading}
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-950 transition-all"
            >
              {loading ? 'Cadastrando...' : 'Registrar'}
            </button>

            <p className="text-sm text-center mt-4 text-gray-700">
              Já possui conta?{' ' }
              <a
                href="/auth/login"
                className="text-blue-900 underline hover:text-blue-950"
              >
                Fazer login
              </a>
            </p>
          </form>
        </div>

        {/* Rodapé dentro do card */}
        <div className="mt-8 text-xs text-gray-500">
          <p>
            Desenvolvido por <strong>Woldo</strong>
          </p>
          <p className="text-[11px] mt-1">
            Projeto técnico • Next.js 14 + Tailwind + Prisma + JWT
          </p>
        </div>
      </div>

      {/* Rodapé igual ao das outras páginas */}
      <footer className="mt-8 text-gray-400 text-xs sm:text-sm text-center">
        <p>© 2025 Affinity Secure • Todos os direitos reservados</p>
      </footer>
    </main>
  );
}
