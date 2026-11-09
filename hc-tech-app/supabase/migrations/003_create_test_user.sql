-- HC Tech - Usuário de teste para validar login integrado
-- Projeto Supabase: kfczorckyqmyflrutrik
-- Schema: public
-- Executar no SQL Editor do projeto Supabase.
-- Usado pelo fluxo de teste do Freebuff.

declare
  test_email text := 'teste@hctech.test';
  test_password text := 'TestePass123!';
  created_user record;
  inserted_profile record;
begin
  -- Cria o usuário no auth
  insert into auth.users (email, encrypted_password)
  values (test_email, crypt(test_password, gen_salt('bf', 8)))
  on conflict (email) do update
    set encrypted_password = crypt(test_password, gen_salt('bf', 8))
  returning * into created_user;

  -- Garante perfil no public.profiles
  insert into public.profiles (id, email, full_name, role)
  values (created_user.id, test_email, 'Usuário de Teste', 'chamado')
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        role = excluded.role
  returning * into inserted_profile;

  raise notice 'Usuário de teste criado: % / id: %', test_email, created_user.id;
end;
