-- =========================================================
-- RemontUZ — Storage bucket for portfolio images
-- Supabase SQL Editor da bir marta ishga tushiring
-- =========================================================

-- Bucket yaratish (public read, faqat authenticated yuklash)
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Hamma o'qiy oladi
drop policy if exists "Public read portfolio" on storage.objects;
create policy "Public read portfolio"
on storage.objects for select
using (bucket_id = 'portfolio');

-- Faqat tizimga kirgan foydalanuvchilar yuklay oladi
drop policy if exists "Authenticated upload portfolio" on storage.objects;
create policy "Authenticated upload portfolio"
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio');

-- Faqat o'z fayllarini o'chira oladi
drop policy if exists "Owner delete portfolio" on storage.objects;
create policy "Owner delete portfolio"
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio' and owner = auth.uid());
