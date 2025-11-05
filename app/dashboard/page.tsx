// app/dashboard/page.tsx
// Página de Dashboard com layout responsivo e autenticação via cookie JWT

import Image from 'next/image';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { UserCircle2, LogOut, Mail, Calendar, Award } from 'lucide-react';

export const runtime = 'nodejs';

export default async function DashboardPage() {
  // Lê o token de autenticação armazenado nos cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('auth')?.value || '';
  const user = token ? verifyToken(token) : null;

  // Bloqueia o acesso se o usuário não estiver autenticado
  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-700">
        <p>Você precisa estar logado para acessar o dashboard.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 flex flex-col items-center p-6">
      
      {/* Cabeçalho com logo e botão de logout */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Image
            src="/logo-Affinity-Secure.png"
            alt="Affinity Secure Logo"
            width={60}
            height={60}
            className="drop-shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Olá, {user.fullName.split(' ')[0]}!
            </h1>
            <p className="text-gray-500 text-sm">
              Seja bem-vindo ao seu painel <strong>Affinity Secure</strong>
            </p>
          </div>
        </div>

        <form action="/api/auth/logout" method="post">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </form>
      </header>

      {/* Painel com cartões informativos */}
      <section className="w-full max-w-5xl bg-white shadow-lg rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card: informações pessoais */}
        <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md transition">
          <UserCircle2 className="w-10 h-10 text-blue-600 mb-2" />
          <h2 className="font-semibold text-lg text-gray-800">Informações Pessoais</h2>
          <p className="text-gray-600 text-sm mt-2">{user.fullName}</p>
          <p className="text-gray-500 text-xs">{user.email}</p>
        </div>

        {/* Card: status da conta */}
        <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md transition">
          <Award className="w-10 h-10 text-indigo-600 mb-2" />
          <h2 className="font-semibold text-lg text-gray-800">Status</h2>
          <p className="text-gray-600 text-sm mt-2">Conta verificada</p>
          <p className="text-gray-500 text-xs">Membro desde: 2025</p>
        </div>

        {/* Card: último acesso */}
        <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md transition">
          <Calendar className="w-10 h-10 text-purple-600 mb-2" />
          <h2 className="font-semibold text-lg text-gray-800">Último acesso</h2>
          <p className="text-gray-600 text-sm mt-2">Hoje, às 12:47</p>
          <p className="text-gray-500 text-xs">Local: São Paulo - BR</p>
        </div>
      </section>

      {/* Seção com detalhes adicionais do usuário */}
      <section className="w-full max-w-5xl mt-10 bg-white shadow-lg rounded-2xl p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Informações da Conta
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-semibold text-gray-700">Nome completo</p>
            <p className="text-gray-600">{user.fullName}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">E-mail</p>
            <p className="text-gray-600 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" /> {user.email}
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Cargo</p>
            <p className="text-gray-600">Usuário padrão</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Status</p>
            <p className="text-green-600 font-medium">Ativo</p>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="mt-12 text-xs text-gray-500">
        Copyright <strong>© Woldo</strong>
      </footer>
    </main>
  );
}
