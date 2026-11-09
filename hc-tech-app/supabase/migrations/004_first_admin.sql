-- HC Tech - Primeiro administrador para acesso ao sistema
-- Projeto Supabase: kfczorckyqmyflrutrik
-- Schema: public
-- Executar no SQL Editor do projeto Supabase.
-- Ajuste admin_email e admin_password antes de rodar em produção.

declare
  admin_email text := 'admin@hctech.test';
  admin_password text := 'AdminPass123!';
  created_user record;
  inserted_profile record;
begin
  insert into auth.users (email, encrypted_password)
  values (admin_email, crypt(admin_password, gen_salt('bf', 8)))
  on conflict (email) do update
    set encrypted_password = crypt(admin_password, gen_salt('bf', 8))
  returning * into created_user;

  insert into public.profiles (id, email, full_name, role)
  values (created_user.id, admin_email, 'Administrador', 'admin')
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        role = excluded.role
  returning * into inserted_profile;

  raise notice 'Administrador criado: % / id: %', admin_email, created_user.id;
end;
