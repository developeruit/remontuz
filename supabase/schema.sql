-- =========================================================
-- RemontUZ — Supabase schema + seed data
-- Supabase SQL Editor da ishga tushiring (bir marta)
-- =========================================================

-- ============ TABLES ============

-- profiles: auth.users ga bog'langan foydalanuvchi ma'lumotlari
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  role text not null default 'client' check (role in ('client','master','admin')),
  avatar_url text,
  city text default 'Toshkent',
  created_at timestamptz default now()
);

-- master_profiles: usta qo'shimcha ma'lumotlari
create table if not exists public.master_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.profiles(id) on delete cascade,
  specializations text,
  experience_years int default 0,
  bio text,
  rating numeric(2,1) default 5.0,
  total_reviews int default 0,
  is_verified boolean default false,
  hourly_rate numeric(10,2) default 0,
  city text default 'Toshkent'
);

-- services: xizmat turlari katalogi
create table if not exists public.services (
  id bigserial primary key,
  name text not null,
  category text,
  description text,
  base_price_per_sqm numeric(10,2) default 0,
  icon text
);

-- orders: arizalar
create table if not exists public.orders (
  id bigserial primary key,
  client_id uuid references public.profiles(id) on delete cascade,
  master_id uuid references public.profiles(id) on delete set null,
  service_id bigint references public.services(id),
  title text not null,
  description text,
  area_sqm numeric(8,2),
  address text,
  estimated_price numeric(12,2),
  final_price numeric(12,2),
  status text default 'new' check (status in ('new','in_progress','completed','cancelled')),
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- portfolio_items
create table if not exists public.portfolio_items (
  id bigserial primary key,
  master_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  before_image_url text,
  after_image_url text,
  service_id bigint references public.services(id),
  created_at timestamptz default now()
);

-- reviews
create table if not exists public.reviews (
  id bigserial primary key,
  order_id bigint references public.orders(id) on delete set null,
  client_id uuid references public.profiles(id) on delete cascade,
  master_id uuid references public.profiles(id) on delete cascade,
  rating int check (rating between 1 and 5),
  comment text,
  is_approved boolean default true,
  created_at timestamptz default now()
);

-- materials
create table if not exists public.materials (
  id bigserial primary key,
  name text not null,
  category text,
  unit text,
  price numeric(10,2),
  supplier text,
  image_url text
);

-- messages (chat)
create table if not exists public.messages (
  id bigserial primary key,
  order_id bigint references public.orders(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- ============ TRIGGER: auto-create profile on signup ============
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone, role, city)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    coalesce(new.raw_user_meta_data->>'city', 'Toshkent')
  );
  -- master bo'lsa, master_profile yaratamiz
  if coalesce(new.raw_user_meta_data->>'role', 'client') = 'master' then
    insert into public.master_profiles (user_id) values (new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ ROW LEVEL SECURITY ============
alter table public.profiles         enable row level security;
alter table public.master_profiles  enable row level security;
alter table public.services         enable row level security;
alter table public.orders           enable row level security;
alter table public.portfolio_items  enable row level security;
alter table public.reviews          enable row level security;
alter table public.materials        enable row level security;
alter table public.messages         enable row level security;

-- profiles
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles for select using (true);
drop policy if exists "profiles update self" on public.profiles;
create policy "profiles update self" on public.profiles for update using (auth.uid() = id);

-- master_profiles
drop policy if exists "mp read" on public.master_profiles;
create policy "mp read" on public.master_profiles for select using (true);
drop policy if exists "mp update self" on public.master_profiles;
create policy "mp update self" on public.master_profiles for update using (auth.uid() = user_id);
drop policy if exists "mp insert self" on public.master_profiles;
create policy "mp insert self" on public.master_profiles for insert with check (auth.uid() = user_id);

-- services (public read)
drop policy if exists "services read" on public.services;
create policy "services read" on public.services for select using (true);

-- materials (public read)
drop policy if exists "materials read" on public.materials;
create policy "materials read" on public.materials for select using (true);

-- orders
drop policy if exists "orders read own" on public.orders;
create policy "orders read own" on public.orders for select using (
  auth.uid() = client_id or auth.uid() = master_id or master_id is null
);
drop policy if exists "orders insert client" on public.orders;
create policy "orders insert client" on public.orders for insert with check (auth.uid() = client_id);
drop policy if exists "orders update involved" on public.orders;
create policy "orders update involved" on public.orders for update using (
  auth.uid() = client_id or auth.uid() = master_id or master_id is null
);

-- portfolio_items
drop policy if exists "portfolio read" on public.portfolio_items;
create policy "portfolio read" on public.portfolio_items for select using (true);
drop policy if exists "portfolio insert self" on public.portfolio_items;
create policy "portfolio insert self" on public.portfolio_items for insert with check (auth.uid() = master_id);
drop policy if exists "portfolio delete self" on public.portfolio_items;
create policy "portfolio delete self" on public.portfolio_items for delete using (auth.uid() = master_id);

-- reviews
drop policy if exists "reviews read approved" on public.reviews;
create policy "reviews read approved" on public.reviews for select using (is_approved = true);
drop policy if exists "reviews insert" on public.reviews;
create policy "reviews insert" on public.reviews for insert with check (auth.uid() = client_id);

-- messages
drop policy if exists "messages read" on public.messages;
create policy "messages read" on public.messages for select using (
  auth.uid() in (
    select client_id from public.orders where id = messages.order_id
    union
    select master_id from public.orders where id = messages.order_id
  )
);
drop policy if exists "messages insert" on public.messages;
create policy "messages insert" on public.messages for insert with check (auth.uid() = sender_id);

-- ============ SEED DATA ============
insert into public.services (name, category, description, base_price_per_sqm, icon) values
  ('Ta''mirlash',  'remont',  'Kvartira va uy ta''mirlash',    280000, '🔨'),
  ('Dizayn',       'design',  'Interer dizayn loyihalari',     350000, '🎨'),
  ('Montaj',       'install', 'Elektr va santexnika ishlari',  150000, '⚡'),
  ('Qurilish',     'build',   'Qurilish va rekonstruksiya',    420000, '🧱')
on conflict do nothing;

insert into public.materials (name, category, unit, price, supplier) values
  ('Akril bo''yoq',          'bo''yoq', 'kg',  45000,  'Bau Market'),
  ('Keramik plitka 60x60',   'plitka',  'm²',  120000, 'TileHouse'),
  ('Laminat 32-klass',       'pol',     'm²',  95000,  'Floor.uz'),
  ('Gipsokarton list',       'devor',   'dona', 48000, 'BuildMart'),
  ('Sement M400',            'quruq',   'kg',  1800,   'StroyUz'),
  ('Elektr kabel 2.5mm',     'elektr',  'm',   8500,   'ElektroShop'),
  ('Dekorativ shtukaturka',  'bo''yoq', 'kg',  62000,  'Bau Market'),
  ('Granit plitka',          'plitka',  'm²',  180000, 'TileHouse')
on conflict do nothing;

-- Tayyor! Endi frontend'dan foydalanishingiz mumkin.
-- Admin yaratish: ro'yxatdan o'ting, keyin:
-- update public.profiles set role = 'admin' where email = 'sizning@email.com';
