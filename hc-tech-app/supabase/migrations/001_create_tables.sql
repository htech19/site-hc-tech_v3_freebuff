-- HC Tech - Estrutura inicial do banco
-- Projeto Supabase: kfczorckyqmyflrutrik
-- Schema: public
-- Executar no SQL Editor do projeto Supabase.

-- Extensões
create extension if not exists "uuid-ossp";

-- Função auxiliar para atualizado_em
create or replace function hc_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =========================================
-- profiles
-- =========================================
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  full_name text,
  phone text,
  role text not null default 'chamado' check (role in ('chamado','tecnico','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace trigger profiles_updated_at
  before update on public.profiles
  for each row execute function hc_set_updated_at();

create policy "profiles_read_own"
  on public.profiles for select
  using (auth.jwt() ->> 'sub' = id::text);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.jwt() ->> 'sub' = id::text);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.jwt() ->> 'sub' = id::text);

-- =========================================
-- clientes
-- =========================================
create table if not exists public.clientes (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  email text,
  telefone text,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clientes enable row level security;

create or replace trigger clientes_updated_at
  before update on public.clientes
  for each row execute function hc_set_updated_at();

create policy "clientes_select_all"
  on public.clientes for select
  using (true);

create policy "clientes_insert"
  on public.clientes for insert
  with check (true);

create policy "clientes_update"
  on public.clientes for update
  using (true);

create policy "clientes_delete"
  on public.clientes for delete
  using (true);

-- =========================================
-- os_status
-- =========================================
create table if not exists public.os_status (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  cor text,
  created_at timestamptz not null default now()
);

alter table public.os_status enable row level security;

create policy "os_status_select_all"
  on public.os_status for select
  using (true);

create policy "os_status_insert"
  on public.os_status for insert
  with check (true);

create policy "os_status_update"
  on public.os_status for update
  using (true);

-- =========================================
-- ordens_de_servico
-- =========================================
create table if not exists public.ordens_de_servico (
  id uuid primary key default uuid_generate_v4(),
  numero text not null unique,
  cliente_id uuid references public.clientes(id) on delete set null,
  status_id uuid references public.os_status(id) on delete set null,
  equipamento text,
  marca text,
  modelo text,
  defeito text not null,
  servico_solicitado text,
  tecnico_id uuid references public.profiles(id) on delete set null,
  observacoes text,
  data_entrada timestamptz not null default now(),
  data_saida timestamptz,
  valor_orcamento numeric,
  valor_final numeric,
  desconto numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ordens_de_servico enable row level security;

create or replace trigger os_updated_at
  before update on public.ordens_de_servico
  for each row execute function hc_set_updated_at();

create policy "os_select_all"
  on public.ordens_de_servico for select
  using (true);

create policy "os_insert"
  on public.ordens_de_servico for insert
  with check (true);

create policy "os_update"
  on public.ordens_de_servico for update
  using (true);

create policy "os_delete"
  on public.ordens_de_servico for delete
  using (true);

-- =========================================
-- itens_da_os
-- =========================================
create table if not exists public.itens_da_os (
  id uuid primary key default uuid_generate_v4(),
  os_id uuid not null references public.ordens_de_servico(id) on delete cascade,
  produto_id uuid references public.produtos(id) on delete set null,
  nome text not null,
  quantidade numeric not null default 1,
  custo numeric
);

alter table public.itens_da_os enable row level security;

create policy "itens_da_os_select"
  on public.itens_da_os for select
  using (exists (select 1 from public.ordens_de_servico where id = os_id));

create policy "itens_da_os_insert"
  on public.itens_da_os for insert
  with check (true);

create policy "itens_da_os_update"
  on public.itens_da_os for update
  using (true);

create policy "itens_da_os_delete"
  on public.itens_da_os for delete
  using (true);

-- =========================================
-- categorias
-- =========================================
create table if not exists public.categorias (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  descricao text,
  created_at timestamptz not null default now()
);

alter table public.categorias enable row level security;

create policy "categorias_select_all"
  on public.categorias for select
  using (true);

create policy "categorias_insert"
  on public.categorias for insert
  with check (true);

create policy "categorias_update"
  on public.categorias for update
  using (true);

-- =========================================
-- produtos
-- =========================================
create table if not exists public.produtos (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  categoria_id uuid references public.categorias(id) on delete set null,
  descricao text,
  custo numeric not null default 0,
  preco_venda numeric not null default 0,
  quantidade numeric not null default 0,
  unidade text not null default 'un',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.produtos enable row level security;

create or replace trigger produtos_updated_at
  before update on public.produtos
  for each row execute function hc_set_updated_at();

create policy "produtos_select_all"
  on public.produtos for select
  using (true);

create policy "produtos_insert"
  on public.produtos for insert
  with check (true);

create policy "produtos_update"
  on public.produtos for update
  using (true);

create policy "produtos_delete"
  on public.produtos for delete
  using (true);

-- =========================================
-- orcamentos
-- =========================================
create table if not exists public.orcamentos (
  id uuid primary key default uuid_generate_v4(),
  numero text not null unique,
  cliente_nome text,
  cliente_email text,
  cliente_telefone text,
  equipamento text,
  marca text,
  modelo text,
  defeito text not null,
  servico_solicitado text,
  data_solicitacao date not null,
  data_validade date,
  custo_pecas numeric not null default 0,
  frete numeric not null default 0,
  outros_custos numeric not null default 0,
  valor_venda_pecas numeric not null default 0,
  mao_de_obra numeric not null default 0,
  desconto numeric not null default 0,
  garantia numeric not null default 30,
  created_at timestamptz not null default now()
);

alter table public.orcamentos enable row level security;

create policy "orcamentos_select_all"
  on public.orcamentos for select
  using (true);

create policy "orcamentos_insert"
  on public.orcamentos for insert
  with check (true);

create policy "orcamentos_update"
  on public.orcamentos for update
  using (true);

create policy "orcamentos_delete"
  on public.orcamentos for delete
  using (true);

-- =========================================
-- contatos
-- =========================================
create table if not exists public.contatos (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  telefone text,
  email text,
  prioridade text not null default 'normal' check (prioridade in ('normal','alta','urgente')),
  data_vencimento date,
  notas text,
  created_at timestamptz not null default now()
);

alter table public.contatos enable row level security;

create policy "contatos_select_all"
  on public.contatos for select
  using (true);

create policy "contatos_insert"
  on public.contatos for insert
  with check (true);

create policy "contatos_update"
  on public.contatos for update
  using (true);

create policy "contatos_delete"
  on public.contatos for delete
  using (true);

-- =========================================
-- services
-- =========================================
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  categoria text not null check (categoria in ('celular','notebook','desktop','outro')),
  preco_padrao numeric,
  descricao text,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;

create policy "services_select_all"
  on public.services for select
  using (true);

create policy "services_insert"
  on public.services for insert
  with check (true);

create policy "services_update"
  on public.services for update
  using (true);

create policy "services_delete"
  on public.services for delete
  using (true);
