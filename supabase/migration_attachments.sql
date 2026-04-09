-- Orders jadvaliga fayl ilovalar uchun ustun qo'shish
-- Supabase SQL Editor da bir marta ishga tushiring

alter table public.orders
  add column if not exists attachments text[] default '{}';
