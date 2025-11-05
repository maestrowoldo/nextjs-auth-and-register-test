# Affinity Secure — Sistema de Autenticação com Next.js 14+

Um sistema completo de **autenticação moderna e segura**, desenvolvido em **Next.js 14**, com **validação via Zod**, **proteção CSRF**, **JWT com cookies HttpOnly**, e **controle de taxa (rate limit)**.  
O projeto foi estruturado para ser limpo, escalável e com uma interface profissional utilizando **Tailwind CSS**.

---

##  Tecnologias Utilizadas

- **Next.js 14** — framework React com suporte a rotas App Router e Server Actions.  
- **TypeScript** — tipagem estática para segurança e legibilidade.  
- **Prisma ORM** — integração com banco de dados relacional.  
- **Zod** — validação de dados no cliente e servidor.  
- **JWT (jsonwebtoken)** — autenticação baseada em tokens.  
- **bcryptjs** — criptografia de senhas.  
- **LRU Cache** — implementação de rate limiting.  
- **Lucide React** — ícones leves e modernos.  
- **Tailwind CSS** — design limpo e responsivo.

---

##  Estrutura do Projeto

app/

├── api/
│ └── auth/
│ ├── csrf/route.ts # Gera e define token CSRF
│ ├── login/route.ts # Rota de autenticação (login)
│ ├── logout/route.ts # Logout seguro
│ └── register/route.ts # Registro de novos usuários
│
├── auth/
│ ├── login/page.tsx # Página de login
│ └── register/page.tsx # Página de registro
│
└── dashboard/
└── page.tsx # Painel do usuário autenticado
│
lib/
├── auth.ts # JWT, bcrypt, cookies e CSRF
├── db.ts # Configuração do Prisma Client
├── rate-limit.ts # Implementação de rate limiting
└── validation.ts # Schemas Zod (login e registro)


---

##  Fluxo de Autenticação

1. **Registro:**  
   O usuário preenche os dados → o backend valida via **Zod** → senha é **criptografada com bcrypt** → dados são salvos no banco via **Prisma**.

2. **Login:**  
   - O usuário envia credenciais + token **CSRF**.  
   - É feito o **rate limit** (máx. 10 tentativas/minuto).  
   - Se válidas, é gerado um **JWT assinado** e salvo em um **cookie HttpOnly**.  
   - O middleware protege o `/dashboard` e redireciona se o token for inválido.

3. **Dashboard:**  
   - Decodifica o JWT do cookie e exibe as informações do usuário.  
   - Inclui botão de **logout**, que remove o cookie e redireciona para `/`.

4. **Proteções de segurança incluídas:**
   - **CSRF (Double-Submit Token)**
   - **Rate limiting por IP**
   - **JWT HttpOnly + Secure**
   - **Validação de dados forte com Zod**

---


###  Clonar o projeto
```bash
git clone https://github.com/seuusuario/affinity-secure.git
cd affinity-secure



Observação

Este projeto foi desenvolvido como teste técnico de autenticação com foco em boas práticas de segurança, tipagem e escalabilidade no ecossistema Next.js.
