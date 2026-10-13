-- =====================================================================
-- PLANECITOS · Esquema inicial de Supabase (MVP)
-- Pegar completo en Supabase > SQL Editor > New query > Run
-- =====================================================================

-- ---------- 1. TABLAS ----------

-- Perfil del adulto (1 por usuario de Supabase Auth)
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  name        text,
  is_premium  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Niño asociado al usuario (solo apodo opcional + edad: datos mínimos)
create table public.children (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  nickname    text,
  age         smallint not null check (age between 2 and 5),
  created_at  timestamptz not null default now()
);
create index children_user_id_idx on public.children(user_id);

-- Actividades (los "planecitos")
create table public.activities (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,
  title              text not null,
  short_description  text not null,
  description        text not null,
  min_age            smallint not null check (min_age between 2 and 5),
  max_age            smallint not null check (max_age between 2 and 5),
  duration           smallint not null check (duration in (5, 15, 30)),
  category           text not null check (category in ('crear','moverse','aprender','tranquilo','juntos','solo')),
  location           text not null check (location in ('casa','afuera','cualquier')),
  materials          text[] not null default '{}',
  material_tags      text[] not null default '{}',
  adult_help         boolean not null default false,
  preparation        text not null default '',
  steps              text[] not null default '{}',
  tip                text not null default '',
  premium            boolean not null default false,
  image_url          text,
  published          boolean not null default true,
  created_at         timestamptz not null default now(),
  check (min_age <= max_age)
);

-- Favoritos ("Mis planecitos")
create table public.favorites (
  user_id      uuid not null references public.profiles(id) on delete cascade,
  activity_id  uuid not null references public.activities(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (user_id, activity_id)
);

-- Compras que llegan desde el webhook de Hotmart
create table public.purchases (
  id                   uuid primary key default gen_random_uuid(),
  email                text not null,
  buyer_name           text,
  hotmart_transaction  text not null unique,
  hotmart_product_id   text,
  status               text not null,   -- PURCHASE_APPROVED, PURCHASE_REFUNDED, etc.
  raw                  jsonb,           -- payload completo, para revisar errores
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index purchases_email_idx on public.purchases (lower(email));

-- Eventos de uso (para aprender qué funciona)
create table public.activity_events (
  id           bigint generated always as identity primary key,
  user_id      uuid references public.profiles(id) on delete set null,
  activity_id  uuid references public.activities(id) on delete cascade,
  event        text not null check (event in ('shown','opened','completed','dismissed','favorited')),
  created_at   timestamptz not null default now()
);

-- ---------- 2. FUNCIONES DE APOYO ----------

-- ¿El usuario actual es premium?
create or replace function public.is_premium()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce((select p.is_premium from public.profiles p where p.id = auth.uid()), false);
$$;

-- ¿Este correo tiene una compra válida?
create or replace function public.email_has_valid_purchase(p_email text)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.purchases
    where lower(email) = lower(p_email)
      and status in ('PURCHASE_APPROVED','PURCHASE_COMPLETE')
  );
$$;

-- Catálogo público: datos para mostrar tarjetas (incluye premium bloqueados),
-- SIN pasos ni detalle. Lo puede llamar cualquiera, incluso sin cuenta.
create or replace function public.get_catalog()
returns table (
  id uuid, slug text, title text, short_description text,
  min_age smallint, max_age smallint, duration smallint,
  category text, location text, material_tags text[],
  adult_help boolean, premium boolean, image_url text
)
language sql stable security definer set search_path = ''
as $$
  select id, slug, title, short_description, min_age, max_age, duration,
         category, location, material_tags, adult_help, premium, image_url
  from public.activities
  where published
  order by created_at;
$$;

-- ---------- 3. AUTOMATIZACIONES (TRIGGERS) ----------

-- Al registrarse: crear perfil y activar premium si ya compró con ese correo
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, name, is_premium)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'name',
    public.email_has_valid_purchase(new.email)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Al llegar o cambiar una compra: activar o quitar premium a la cuenta con ese correo
create or replace function public.sync_premium_after()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  update public.profiles
    set is_premium = public.email_has_valid_purchase(new.email)
    where lower(email) = lower(new.email);
  return null;
end;
$$;

create trigger on_purchase_change
  after insert or update on public.purchases
  for each row execute function public.sync_premium_after();

-- Mantener updated_at al día en compras
create or replace function public.touch_updated_at()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger purchases_touch_updated_at
  before update on public.purchases
  for each row execute function public.touch_updated_at();

-- ---------- 4. SEGURIDAD (RLS) ----------

alter table public.profiles        enable row level security;
alter table public.children        enable row level security;
alter table public.activities      enable row level security;
alter table public.favorites       enable row level security;
alter table public.purchases       enable row level security;
alter table public.activity_events enable row level security;

-- profiles: cada quien ve su perfil y solo puede cambiar su nombre
create policy "ver mi perfil" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "editar mi perfil" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated, anon;
grant update (name) on public.profiles to authenticated;   -- is_premium NO se puede tocar desde la web

-- children: CRUD solo de mis niños
create policy "ver mis ninos" on public.children
  for select to authenticated using (user_id = auth.uid());
create policy "crear mis ninos" on public.children
  for insert to authenticated with check (user_id = auth.uid());
create policy "editar mis ninos" on public.children
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "borrar mis ninos" on public.children
  for delete to authenticated using (user_id = auth.uid());

-- activities: el detalle completo de las gratis lo ve cualquiera;
-- el de las premium, solo usuarios premium. (El catálogo de tarjetas va por get_catalog)
create policy "ver actividades gratis" on public.activities
  for select to anon, authenticated using (published and not premium);
create policy "ver actividades premium" on public.activities
  for select to authenticated using (published and premium and public.is_premium());

-- favorites: solo los míos
create policy "ver mis favoritos" on public.favorites
  for select to authenticated using (user_id = auth.uid());
create policy "agregar favorito" on public.favorites
  for insert to authenticated with check (user_id = auth.uid());
create policy "quitar favorito" on public.favorites
  for delete to authenticated using (user_id = auth.uid());

-- purchases: el usuario solo ve sus compras; solo el webhook (service role) escribe
create policy "ver mis compras" on public.purchases
  for select to authenticated using (lower(email) = lower(auth.jwt() ->> 'email'));

-- activity_events: el usuario registra sus propios eventos
create policy "registrar mis eventos" on public.activity_events
  for insert to authenticated with check (user_id = auth.uid());

-- Permisos de las funciones
revoke execute on function public.email_has_valid_purchase(text) from anon, authenticated, public;
grant execute on function public.get_catalog() to anon, authenticated;
grant execute on function public.is_premium() to authenticated;
