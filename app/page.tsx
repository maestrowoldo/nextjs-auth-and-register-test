// app/page.tsx
// Página inicial moderna, ampla e responsiva - Affinity Secure

import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-8">
      {/* Container com moldura azul responsiva */}
      <div className="w-full max-w-4xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-800 rounded-3xl shadow-2xl p-[3px]">
        {/* Conteúdo interno branco */}
        <div className="bg-white rounded-[1.4rem] p-10 sm:p-12 flex flex-col items-center text-center">
          {/* Logo */}
          <Image
            src="/logo-Affinity-Secure.png"
            alt="Affinity Secure Logo"
            width={130}
            height={130}
            className="mb-6 drop-shadow-md"
          />

          {/* Título */}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Affinity Secure
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-2xl">
            Um sistema de autenticação moderno, seguro e projetado para oferecer
            a melhor experiência ao usuário.
          </p>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <a
              href="/auth/register"
              className="w-full sm:w-48 bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-950 transition-all"
            >
              Criar Conta
            </a>
            <a
              href="/auth/login"
              className="w-full sm:w-48 border border-gray-300 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              Fazer Login
            </a>

          </div>

          {/* Rodapé */}
          <div className="mt-10 text-xs text-gray-500">
            <p>
              Desenvolvido por <strong>Woldo</strong> 
            </p>
            <p className="text-[11px] mt-1">
              Projeto técnico • Next.js 14 + Tailwind + Prisma + JWT
            </p>
          </div>
        </div>
      </div>

      {/* Créditos abaixo */}
      <footer className="mt-8 text-gray-400 text-xs sm:text-sm text-center">
        <p>© 2025 Affinity Secure • Todos os direitos reservados</p>
      </footer>
    </main>
  );
}
