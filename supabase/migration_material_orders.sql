-- =========================================================
-- Material orders (savat buyurtmalari) jadvali
-- Supabase SQL Editor da bir marta ishga tushiring
-- =========================================================

create table if not exists public.material_orders (
  id bigserial primary key,
  client_id uuid references public.profiles(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,  -- [{id, name, price, unit, qty}]
  total_price numeric(12,2) not null default 0,
  full_name text,
  phone text,
  address text,
  status text default 'pending' check (status in ('pending','confirmed','delivered','cancelled')),
  created_at timestamptz default now()
);

-- RLS yoqish
alter table public.material_orders enable row level security;

-- Foydalanuvchi o'z buyurtmalarini ko'radi
drop policy if exists "material_orders_read_own" on public.material_orders;
create policy "material_orders_read_own" on public.material_orders
  for select using (auth.uid() = client_id);

-- Mijoz o'z nomidan buyurtma yaratadi
drop policy if exists "material_orders_insert_self" on public.material_orders;
create policy "material_orders_insert_self" on public.material_orders
  for insert with check (auth.uid() = client_id);

-- Foydalanuvchi bekor qilishi mumkin
drop policy if exists "material_orders_update_own" on public.material_orders;
create policy "material_orders_update_own" on public.material_orders
  for update using (auth.uid() = client_id);

-- Adminlar hammasini ko'radi
drop policy if exists "material_orders_admin_all" on public.material_orders;
create policy "material_orders_admin_all" on public.material_orders
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
