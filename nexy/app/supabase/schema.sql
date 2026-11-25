-- Nexy: perfis de usuário
-- Rode no Supabase: menu SQL Editor > New query > cole tudo > Run.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text,
  email text,
  telefone text,
  plano text not null default 'gratis',
  teste_ia_ate timestamptz not null default (now() + interval '7 days'),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Cada pessoa só vê e edita o próprio perfil.
drop policy if exists "perfil: ler o próprio" on public.profiles;
create policy "perfil: ler o próprio" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "perfil: editar o próprio" on public.profiles;
create policy "perfil: editar o próprio" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Plano e teste da IA não podem ser alterados pelo app (só pelo servidor).
revoke update (plano, teste_ia_ate) on public.profiles from authenticated;

-- Cria o perfil automaticamente quando a conta é criada.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nome, email, telefone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'nome',
    lower(new.raw_user_meta_data ->> 'email'),
    new.phone
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Mantém o telefone do perfil igual ao da conta quando ele muda.
create or replace function public.handle_user_phone_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set telefone = new.phone, atualizado_em = now() where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_phone_changed on auth.users;
create trigger on_auth_user_phone_changed
  after update of phone on auth.users
  for each row when (old.phone is distinct from new.phone)
  execute function public.handle_user_phone_change();
