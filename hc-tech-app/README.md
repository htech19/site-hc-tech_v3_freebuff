# HC Tech - Sistema de Gestão de Assistência Técnica

Front-end do sistema HC Tech, feito com React 19, TypeScript, Vite 8, Tailwind 4, Supabase, React Router 7 e Zustand.

## O que tem nesse projeto

- Login: página de login com suporte a e-mail/senha mock e OAuth (Google/GitHub)
- Dashboard
- Ordens de Serviço (OS)
- Orçamentos
- Estoque
- Clientes
- Tema claro/escuro

## Pré-requisitos

- Node.js
- npm (ou outro gerenciador compatível)
- Conta Supabase, projeto PostgreSQL criado

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha as chaves do Supabase:

```bash
cp .env.example .env
```

Exemplo:

```env
VITE_SUPABASE_URL=https://kfczorckyqmyflrutrik.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxx
```

A chave recomendada para uso no frontend é a **Publishable/Anon**. A chave Service Role/Secret nunca deve virar para o navegador ou ficar no repositório.

O sistema usa fallback local enquanto `.env` não estiver configurado, mas a integração real com Supabase depende dessas duas variáveis.

## Instalação

```bash
cd hc-tech-app
npm install
```

## Rodar localmente

```bash
npm run dev
```

Por padrão o app abre em `http://localhost:5173`, ou na próxima porta livre.

## Construir para produção

```bash
npm run build
```

O resultado fica em `dist/`.

## Deploy

Sugestões comuns para publicar depois de construído:

- Vercel static deploy (`npm run build` → `dist`)
- Netlify
- Deploy estático no próprio domínio com reverse proxy (Nginx, Apache, etc.)

Para usar o mesmo domínio `.com.br`, configure o DNS e aponte a hospedagem estática ou o proxy para a build gerada.

## Supabase: primeira configuração do banco

O projeto Supabase vem sem tabelas. É possível criar a estrutura necessária pelo SQL Editor do projeto Supabase, usando os scripts de migração gerados com este app. As tabelas e políticas de RLS devem seguir o modelo de acesso do app, com acesso via chave anon e proteção por políticas.

## Stack

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- Supabase
- React Router 7
- TanStack Query
- Zustand
- Lucide React
- Recharts (onde usado)
- React Hook Form + Zod (disponível nas dependências)

## Lint / qualidade

Você pode rodar `npm run lint` quando o projeto tiver o script configurado. A regra de oxlint está no `.oxlintrc.json`.

## Segurança

- Nunca commite `.env`, `.env.local` ou qualquer arquivo com chaves reais
- Mantenha RLS ativo no Supabase
- Use a chave service role apenas em funções/backends confiáveis, nunca no front

## Tipo de projeto

Projeto web application, SPA, com possível shell PWA/android futura.
