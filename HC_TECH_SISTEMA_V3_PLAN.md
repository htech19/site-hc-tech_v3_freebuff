# HC TECH SISTEMA V3 - PLANO DE ARQUITETURA

## 📋 Visão Geral do Projeto

**Objetivo:** Reescrever o sistema HC TECH com codebase moderno, modular e preparado para gerar App Android do módulo "Sistema".

**Pasta do projeto:** `C:\Users\hunlock\Documents\LOJA_HC\Site\site-hc-tech_v3_freebuff`

**Data de início:** Novembro 2026

---

## 🎯 DECISÕES DE STACK

### Frontend Web (Confirmado)
| Tecnologia | Versão | Motivo |
|-----------|--------|--------|
| React | 18.x | Ecossistema maduro, reutilização de conhecimento |
| TypeScript | 5.x | Tipagem forte, melhor DX |
| Vite | 6.x | Build rápido, HMR excelente |
| Tailwind CSS | 3.4+ | Utility-first, shadcn/ui compatível |
| shadcn/ui | latest | Components acessíveis, personalizáveis |
| Zustand | latest | Estado simples e eficiente |
| TanStack Query | latest | Server state, cache, revalidate |
| React Router | 6.x | Routing declarativo |

### Backend / Banco de Dados
| Tecnologia | Motivo |
|-----------|--------|
| Supabase | PostgreSQL + Auth + Realtime + Storage em um |
| Drizzle ORM (opcional) | Typesafe, leve, migrations |
| RLS | Segurança nivel de linha nativa |

### App Android (DECISÃO A VALIDAR)

#### Opção Recomendada: **Capacitor + WebView Wrapper**
**Por que:** 
- ✅ Reutiliza 100% do código web
- ✅ Build simples para APK/AAB
- ✅ Acesso a plugins nativos (câmera, notificações,storage)
- ✅ Offline com service workers + localStorage
- ✅ Menor complexidade vs React Native

**Alternativas a considerar:**
- React Native/Expo: se precisar de UI nativa complexa
- PWA apenas: seinstalação via Chrome for suficiente

---

## 📁 NOVA ESTRUTURA DE ARQUIVOS

```
site-hc-tech_v3_freebuff/
├── public/
│   ├── favicon.svg
│   └── icons/              # Para PWA e Android
├── src/
│   ├── main.tsx           # Entry point
│   ├── App.tsx            # Root component + Router
│   ├── index.css          # Global styles + Tailwind
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   ├── layout/        # Header, Sidebar, Footer, PageWrapper
│   │   ├── auth/          # LoginForm, RegisterForm, OAuthButtons
│   │   ├── dashboard/     # StatsCard, ChartWidget, RecentOS
│   │   ├── os/           # OSForm, OSList, OSDetail, StatusBadge
│   │   ├── orcamento/    # OrcamentoWizard, FinanceCalculator
│   │   ├── estoque/      # ProductTable, BulkActions, ProductForm
│   │   ├── clientes/     # ClientTable, ClientForm, CSVImporter
│   │   └── shared/       # LoadingSpinner, ErrorBoundary, ConfirmDialog
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useOS.ts
│   │   ├── useOrcamento.ts
│   │   ├── useEstoque.ts
│   │   ├── useClientes.ts
│   │   └── utils/
│   │       ├── useFormatPhone.ts
│   │       ├── useFormatCurrency.ts
│   │       └── useTelefoneMask.ts
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts      # Supabase client
│   │   │   ├── server.ts      # Server-side client (se SSR)
│   │   │   └── middleware.ts  # Auth middleware
│   │   ├── utils.ts           # CN, formatters, validators
│   │   └── constants.ts       # Serviços, categorias, status
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── themeStore.ts
│   │   └── uiStore.ts
│   ├── types/
│   │   ├── database.ts        # Types gerados do Supabase
│   │   ├── sistema.ts         # OS, Orçamento, Cliente, etc
│   │   └── api.ts             # API response types
│   ├── pages/                 # ou routes/, dependendo da abordagem
│   │   ├── (auth)/
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   ├── (dashboard)/
│   │   │   └── dashboard.tsx
│   │   ├── sistema/
│   │   │   ├── os/
│   │   │   │   ├── index.tsx      # Lista de OS
│   │   │   │   ├── new.tsx        # Novo OS (wizard)
│   │   │   │   └── [id]/
│   │   │   │       └── detail.tsx
│   │   │   ├── orcamentos/
│   │   │   │   ├── index.tsx
│   │   │   │   └── new.tsx
│   │   │   ├── estoque/
│   │   │   │   └── index.tsx
│   │   │   └── clientes/
│   │   │       └── index.tsx
│   │   └── layout.tsx
│   └── config/
│       ├── routeConfig.ts
│       └── supabase.ts
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_indexes.sql
│   │   └── 003_rls_policies.sql
│   ├── seed.sql
│   └── config.toml
├── capacitor/
│   ├── android/
│   ├── ios/
│   └── CapacitorApp/
├── tests/
│   ├── unit/
│   └── e2e/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── postcss.config.js
├── components.json          # shadcn/ui config
├── drizzle.config.ts        # Se usar Drizzle
├── .env.example
├── .gitignore
├── README.md
└── HC_TECH_SISTEMA_V3.md    # Documentação completa
```

---

## 🗄️ ESQUEMA DO BANCO (PROJETO NOVO)

### Tabelas Principais

```sql
-- Usuários (authenticate pelo Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'chamado', -- 'chamado', 'tecnico', 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clientes
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categorias de produtos
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Produtos (estoque)
CREATE TABLE produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  categoria_id UUID REFERENCES categorias(id),
  descricao TEXT,
  custo NUMERIC(10,2) DEFAULT 0,
  preco_venda NUMERIC(10,2) DEFAULT 0,
  quantidade INTEGER DEFAULT 0,
  unidade TEXT DEFAULT 'un',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Status das OS
CREATE TABLE os_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE, -- 'Aguardando', 'Em Andamento', 'Concluído', 'Entregue'
  cor TEXT DEFAULT '#6B7280',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ordens de Serviço
CREATE TABLE os (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT UNIQUE NOT NULL, -- Ex: 'OS-0001'
  cliente_id UUID REFERENCES clientes(id),
  status_id UUID REFERENCES os_status(id),
  equipamento TEXT,
  marca TEXT,
  modelo TEXT,
  defeito TEXT NOT NULL,
  servico_solicitado TEXT,
  tecnico_id UUID REFERENCES profiles(id),
  observacoes TEXT,
  data_entrada TIMESTAMPTZ DEFAULT NOW(),
  data_saida TIMESTAMPTZ,
  valor_orcamento NUMERIC(10,2),
  valor_final NUMERIC(10,2),
  desconto NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itens de OS (peças utilizadas)
CREATE TABLE os_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  os_id UUID REFERENCES os(id) ON DELETE CASCADE,
  produto_id UUID REFERENCES produtos(id),
  nome TEXT NOT NULL,
  quantidade INTEGER DEFAULT 1,
  custo NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orçamentos (versão anterior à OS)
CREATE TABLE orcamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero TEXT UNIQUE NOT NULL,
  cliente_nome TEXT,
  cliente_email TEXT,
  cliente_telefone TEXT,
  equipamento TEXT,
  marca TEXT,
  modelo TEXT,
  defeito TEXT,
  servico_solicitado TEXT,
  data_solicitacao DATE,
  data_validade DATE,
  custo_pecas NUMERIC(10,2) DEFAULT 0,
  frete NUMERIC(10,2) DEFAULT 0,
  outros_custos NUMERIC(10,2) DEFAULT 0,
  custo_total NUMERIC(10,2) GENERATED ALWAYS AS (custo_pecas + frete + outros_custos) STORED,
  valor_venda_pecas NUMERIC(10,2) DEFAULT 0,
  mao_de_obra NUMERIC(10,2) DEFAULT 0,
  desconto NUMERIC(10,2) DEFAULT 0,
  valor_final NUMERIC(10,2) GENERATED ALWAYS AS (valor_venda_pecas + mao_de_obra - desconto) STORED,
  garantia INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contatos
CREATE TABLE contatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
 prioridade TEXT DEFAULT 'normal', -- 'normal', 'alta', 'urgente'
  data_vencimento DATE,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Horário de atendimento
CREATE TABLE horarios_atendimento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dia_semana INTEGER CHECK (dia_semana >= 0 AND dia_semana <= 6),
  hora_abertura TIME,
  hora_fechamento TIME,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storage: fotos de entrada/saída
-- buckets: 'fotos-os' com policies adequadas
```

### Policies RLS (Exemplo)
```sql
ALTER TABLE os ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver suas próprias OS
CREATE POLICY "Users can view own OS" ON os
  FOR SELECT USING (tecnico_id = auth.uid() OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Todos podem criar OS
CREATE POLICY "Users can insert OS" ON os
  FOR INSERT WITH CHECK (true);

-- Apenas os proprietários podem atualizar
CREATE POLICY "Users can update own OS" ON os
  FOR UPDATE USING (tecnico_id = auth.uid() OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
```

---

## 📱 APP ANDROID - SPECIFICACOES

### Abordagem: Capacitor

#### Plugins Necessários
- `@capacitor/camera` - Fotos de OS
- `@capacitor/push-notifications` - Notificações
- `@capacitor/share` - Compartilhar OS/Orçamento
- `@capacitor/storage` - Cache offline
- `@capacitor/filesystem` - Acesso a fotos locais

#### Funcionalidades Offline
- Cache de clientes recentes
- OS em andamento disponíveis offline
- Sincronização ao reconectar

#### Build
- `npx cap add android`
- `npx cap sync`
- `npx cap open android` → abre Android Studio
- Build APK: `./gradlew assembleDebug`
- Build AAB: `./gradlew bundleRelease`

---

## 🔄 FLUXO DE MIGRAÇÃO DE DADOS

Se houver dados no banco atual:
1. Exportar dados atuais (CSV ou SQL)
2. Mapear para novo schema
3. Importar no novo projeto Supabase
4. Verificar integridade

---

## ✅ CHECKLIST INICIAL

- [ ] Criar projeto Vite + React + TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Instalar shadcn/ui
- [ ] Configurar Supabase (novo projeto)
- [ ] Criar migrations do schema
- [ ] Implementar auth (login/registro)
- [ ] Implementar dashboard
- [ ] Implementar OS (CRUD completo)
- [ ] Implementar Orçamentos
- [ ] Implementar Estoque
- [ ] Implementar Clientes
- [ ] Configurar Capacitor para Android
- [ ] Testar build APK
- [ ] Configurar PWA
- [ ] Escrever testes básicos
- [ ] Documentar tudo

---

## 📝 NOTAS

- Manter compatibilidade com dados existentes do Supabase atual se necessário
- Dark mode desde o início
- Responsivo mobile-first
- Acessível (ARIA, contraste)
- Logs de auditoria para OS e orçamentos
