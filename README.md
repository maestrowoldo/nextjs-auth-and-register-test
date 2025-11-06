# Affinity Secure — Sistema de Autenticação com Next.js 14+
<p align="center">
  <img src="./public/Tela_Inicial.jpg" alt="Tela de Inicial" width="500"/>
</p>

**Affinity Secure** é um sistema de autenticação completo e moderno, desenvolvido com **Next.js 14**, **TypeScript**, **Prisma ORM** e **Tailwind CSS**.  
O projeto implementa autenticação segura com **hash de senha (bcrypt)**, **validação CSRF**, **JWT tokens** e **proteção de rotas**.  
Totalmente responsivo, com **interfaces modernas e limpas**, projetadas para uso em **web e mobile**.

---


> **Assista à demonstração completa no YouTube:**  
> [![Ver vídeo]**https://1drv.ms/v/c/37cd42e69fce9179/ERZHTusPMSNApmDBsieAt-IBT5ZGAoYPq409neGs6_Fu5w?e=MAoZ6v**

> Caso prefira, veja a versão hospedada:  
> **https://nextjs-auth-and-register-test.vercel.app/auth/login**

### Cadastro de Usuário
- Campos: nome completo, e-mail, senha e confirmação.  
- Validação de dados com **Zod** no cliente e servidor.  
- Verificação automática de e-mail existente.  
- Redirecionamento automático para tela de login após sucesso.

### Login e Sessão
- Login com e-mail e senha.  
- Autenticação com **JWT + cookies seguros** (httpOnly).  
- Opção “Lembrar-me” para sessões persistentes.  
- Logout com limpeza completa do cookie.  
- Proteção contra **CSRF e XSS**.

### Dashboard
- Acesso restrito apenas a usuários autenticados.  
- Exibe informações do usuário logado.  
- Botão de logout seguro.  

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

# Estrutura do Projeto
```

.
├── app/
│   ├── auth/                   # Agrupador de rotas de autenticação
│   │   ├── register/             # Página de registro
│   │   │   └── page.tsx          # Formulário de criação de conta
│   │   └── login/                # Página de login
│   │       └── page.tsx          # Formulário de autenticação
│   │
│   ├── dashboard/                # Área protegida (usuário autenticado)
│   │   └── page.tsx              # Página inicial do painel do usuário
│   │
│   ├── api/                      # Rotas de API do Next.js
│   │   └── auth/                 # Endpoints de autenticação
│   │       ├── register/route.ts # Registro de novo usuário (POST)
│   │       ├── login/route.ts    # Autenticação (POST)
│   │       └── logout/route.ts   # Encerramento de sessão (POST)
│   │
│   └── layout.tsx                # Layout principal da aplicação
│
├── lib/
│   ├── auth.ts                   # JWT, bcrypt, cookies e CSRF
│   ├── db.ts                     # Configuração do Prisma Client
│   ├── rate-limit.ts             # Controle de requisições e segurança
│   └── validation.ts             # Schemas Zod (login e registro)
│
├── prisma/
│   └── schema.prisma             # Definição dos modelos e conexão com o banco
│       # Contém:
│       #   - Model "User" (dados do usuário)
│       #   - Datasource "db" (configuração do banco)
│       #   - Generator "client" (para o Prisma Client)
│
├── public/                       # Arquivos públicos (imagens, vídeos, ícones)
│   ├── logo.png
│   └── favicon.ico
│
├── middleware.ts                 # Middleware global para autenticação e rotas
├── .env                          # Variáveis de ambiente (ex: DATABASE_URL, JWT_SECRET)
├── package.json                  # Dependências e scripts do projeto
└── README.md                     # Documentação principal
```
---

## Fluxo de Autenticação

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



##  Clonar o projeto
```bash
git clone https://github.com/maestrowoldo/nextjs-auth-and-register-test.git
cd nextjs-auth-and-register-test
```
## Instalar as dependências
```bash
   npm install
```

## Criar o Arquivo .env
```bash
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua_chave_jwt"
CSRF_SECRET="sua_chave_csrf"
NODE_ENV="development"
```

### Segurança Implementada

 - Criptografia de senhas com bcryptjs
 - Tokens JWT armazenados em cookies httpOnly
 - Proteção CSRF (Double Submit Token)
 - Sanitização de dados no servidor
 - Variáveis sensíveis em .env (não versionadas)
 - Rate-limiting básico (opcional via middleware)

 ### Boas Práticas
   - Código comentado e organizado por camadas (lib, app, api)
   - Reutilização de componentes e validações compartilhadas
   - Design responsivo com Tailwind
   - Aderência ao padrão ESLint/Prettier
   - Deploy automatizado via GitHub → Vercel


### Observação
Este projeto foi desenvolvido como teste técnico de autenticação com foco em boas práticas de segurança, tipagem e escalabilidade no ecossistema Next.js.
