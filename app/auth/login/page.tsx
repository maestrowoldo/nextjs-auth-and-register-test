'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LoginSchema } from '@/lib/validation';

// Função para buscar token CSRF
async function fetchCsrfToken() {
  const res = await fetch('/api/auth/csrf');
  const data = await res.json();
  return data.csrfToken || '';
}

export default function LoginPage() {
  const router = useRouter();
  const [csrf, setCsrf] = useState('');
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCsrfToken().then(setCsrf);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    const parsed = LoginSchema.safeParse({ ...form, csrfToken: csrf });
    if (!parsed.success) {
      setMsg('Verifique os campos.');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, csrfToken: csrf }),
    });

    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error || 'Erro ao logar.');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-8">
      {/* Card principal */}
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl p-10 sm:p-14 flex flex-col items-center text-center">
        {/* Logo e título */}
        <Image
          src="/logo-Affinity-Secure.png"
          alt="Affinity Secure Logo"
          width={130}
          height={130}
          className="mb-6 drop-shadow-md"
        />

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Affinity Secure</h1>
        <p className="text-gray-600 text-base mb-8">
          Faça login para acessar sua conta
        </p>

        {/* Formulário */}
        <div className="w-full max-w-md">
          {msg && (
            <p className="text-center text-red-600 text-sm mb-4">{msg}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="E-mail"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Senha"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) =>
                    setForm({ ...form, remember: e.target.checked })
                  }
                />
                Lembrar-me
              </label>
              <a href="#" className="text-blue-800 hover:text-blue-950">
                Esqueceu a senha?
              </a>
            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-950 transition"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <p className="text-sm text-center mt-4 text-gray-700">
              Ainda não tem conta?{' '}
              <a
                href="/auth/register"
                className="text-blue-900 underline hover:text-blue-950"
              >
                Criar agora
              </a>
            </p>
          </form>
        </div>

        {/* Rodapé */}
        <div className="mt-10 text-xs text-gray-500">
          <p>Desenvolvido por <strong>Woldo</strong></p>
          <p className="text-[11px] mt-1">
            Projeto técnico • Next.js 14 + Tailwind + Prisma + JWT
          </p>
        </div>
      </div>

      {/* Créditos */}
      <footer className="mt-8 text-gray-400 text-xs sm:text-sm text-center">
        <p>© 2025 Affinity Secure • Todos os direitos reservados</p>
      </footer>
    </main>
  );
}
