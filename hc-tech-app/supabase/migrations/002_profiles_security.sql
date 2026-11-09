-- HC Tech - Ajuste de segurança para profiles
-- Projeto Supabase: kfczorckyqmyflrutrik
-- Schema: public
-- Executar no SQL Editor do projeto Supabase.
-- Este script pode ser reexecutado.

-- Remover políticas antigas relacionadas ao modelo anterior
do $$
begin
  drop policy if exists "profiles_select_own_or_public" on public.profiles;
  drop policy if exists "profiles_insert_own" on public.profiles;
  drop policy if exists "profiles_update_own" on public.profiles;
end
$$;

-- Permissão de leitura: só o próprio usuário logado pode ver seu perfil
create policy "profiles_select_own"
  on public.profiles for select
  using ((auth.jwt() ->> 'sub')::uuid = id);

-- Permissão de inserção: só o próprio usuário logado pode criar seu perfil
create policy "profiles_insert_own"
  on public.profiles for insert
  with check ((auth.jwt() ->> 'sub')::uuid = id);

-- Permissão de atualização: só o próprio usuário logado pode alterar seu perfil
-- e não pode elevar indevidamente o papel para admin por essa política
create policy "profiles_update_own"
  on public.profiles for update
  using (
    (auth.jwt() ->> 'sub')::uuid = id
    and (
      auth.role() = 'service_role'
      or old.role is not distinct from new.role
      or (new.role is not null and new.role <> 'admin')
    )
  );

-- Se quiser controle mais explícito de criação de admin, use uma função/service_role
-- em vez de permitir escrita direta do campo role pelo usuário comum.

-- Proteção adicional: impedir mudança de role para admin em updates via app comum
-- A política acima já não permite alterar role para 'admin' fora de service_role.
-- Se quiser bloquear qualquer alteração do campo role fora de service_role, pode
-- complementar com trigger ou política mais restritiva conforme necessário.
