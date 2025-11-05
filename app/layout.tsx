// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';

export const metadata: Metadata = {
  title: 'Affinity Prime - Autenticação',
  description: 'Sistema de autenticação moderno desenvolvido por Woldo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        {children}
      </body>
    </html>
  );
}
