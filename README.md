# Affinity Secure — Sistema de Autenticação com Next.js 14+

**Affinity Secure** é um sistema de autenticação completo e moderno, desenvolvido com **Next.js 14**, **TypeScript**, **Prisma ORM** e **Tailwind CSS**.  
O projeto implementa autenticação segura com **hash de senha (bcrypt)**, **validação CSRF**, **JWT tokens** e **proteção de rotas**.  
Totalmente responsivo, com **interfaces modernas e limpas**, projetadas para uso em **web e mobile**.

---

> **Assista à demonstração completa no YouTube:**  
> [![Ver vídeo](https://1drv.ms/v/c/37cd42e69fce9179/ERZHTusPMSNApmDBsieAt-IBT5ZGAoYPq409neGs6_Fu5w?e=MAoZ6v/maxresdefault.jpg)](https://1drv.ms/v/c/37cd42e69fce9179/ERZHTusPMSNApmDBsieAt-IBT5ZGAoYPq409neGs6_Fu5w?e=MAoZ6v)

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

##  Estrutura do Projeto

```
app/
│
├── api/
│ └── auth/
│ ├── csrf/
│ │ └── route.ts # Gera e define o token CSRF
│ ├── login/
│ │ └── route.ts # Rota de autenticação (login)
│ ├── logout/
│ │ └── route.ts # Logout seguro e redirecionamento
│ └── register/
│ └── route.ts # Registro de novos usuários
│
├── auth/
│ ├── login/
│ │ └── page.tsx # Página de login (frontend)
│ └── register/
│ └── page.tsx # Página de registro (frontend)
│
└── dashboard/
└── page.tsx # Painel do usuário autenticado
│
lib/
│
├── auth.ts # Lógica JWT, bcrypt, cookies e CSRF
├── db.ts # Configuração e inicialização do Prisma Client
├── rate-limit.ts # Implementação de rate limiting (proteção de rotas)
└── validation.ts # Schemas Zod (validação de login e registro)```


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

** Instale as dependências**
   npm install

### Segurança Implementada

 Criptografia de senhas com bcryptjs
 Tokens JWT armazenados em cookies httpOnly
 Proteção CSRF (Double Submit Token)
 Sanitização de dados no servidor
 Variáveis sensíveis em .env (não versionadas)
 Rate-limiting básico (opcional via middleware)

 ## Boas Práticas

-Código comentado e organizado por camadas (lib, app, api)
-Reutilização de componentes e validações compartilhadas
-Design responsivo com Tailwind
-Aderência ao padrão ESLint/Prettier
-Deploy automatizado via GitHub → Vercel


Observação

Este projeto foi desenvolvido como teste técnico de autenticação com foco em boas práticas de segurança, tipagem e escalabilidade no ecossistema Next.js.
