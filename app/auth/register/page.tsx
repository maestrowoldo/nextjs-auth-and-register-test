'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { RegisterSchema } from '@/lib/validation';

// Obtém o token CSRF da API
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
    confirmPassword: ''
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Carrega o token CSRF ao montar o componente
  useEffect(() => { fetchCsrfToken().then(setCsrf); }, []);

  // Envio do formulário de registro
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    // Validação com Zod
    const parsed = RegisterSchema.safeParse({ ...form, csrfToken: csrf });
    if (!parsed.success) {
      setMsg('Verifique os campos e tente novamente.');
      setLoading(false);
      return;
    }

    // Envia os dados para a API de registro
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

    // Mensagem de sucesso e redirecionamento
    setMsg('Conta criada com sucesso!');
    setTimeout(() => router.push('/auth/login'), 1000);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-800 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col">
        
        {/* Cabeçalho com logo e título */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 py-6 flex flex-col items-center text-white">
          <Image
            src="/logo-Affinity-Secure.png"
            alt="Affinity Secure Logo"
            width={100}
            height={100}
            className="mb-2 drop-shadow-md"
          />
          <h1 className="text-2xl font-bold">Affinity Secure</h1>
          <p className="text-sm opacity-80">Crie sua conta</p>
        </div>

        {/* Formulário de cadastro */}
        <div className="p-6 sm:p-8 flex-1">
          {msg && <p className="text-center text-green-600 mb-4">{msg}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="Nome completo"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
            />
            <input
              type="email"
              placeholder="E-mail"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Senha"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Confirmar senha"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
            />

            <button
              disabled={loading}
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-950 transition"
            >
              {loading ? 'Cadastrando...' : 'Registrar'}
            </button>

            <p className="text-sm text-center mt-4 text-gray-700">
              Já possui conta?{' '}
              <a href="/auth/login" className="text-blue-800 underline hover:text-blue-950">
                Fazer login
              </a>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
