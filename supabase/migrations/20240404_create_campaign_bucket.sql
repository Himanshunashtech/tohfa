-- Create a public bucket for campaigns if it doesn't already exist
insert into storage.buckets (id, name, public)
values ('campaigns', 'campaigns', true)
on conflict (id) do update set public = true;

-- Drop existing policies if they exist to avoid 'already exists' errors
drop policy if exists "Public Access campaigns" on storage.objects;
drop policy if exists "Public Upload campaigns" on storage.objects;
drop policy if exists "Public Update campaigns" on storage.objects;
drop policy if exists "Public Delete campaigns" on storage.objects;

-- Allow public read access to the 'campaigns' bucket
create policy "Public Access campaigns"
on storage.objects for select
to public
using ( bucket_id = 'campaigns' );

-- Allow public uploads to the 'campaigns' bucket (No sign-in required)
create policy "Public Upload campaigns"
on storage.objects for insert
to public
with check ( bucket_id = 'campaigns' );

-- Allow public updates to the 'campaigns' bucket
create policy "Public Update campaigns"
on storage.objects for update
to public
using ( bucket_id = 'campaigns' );

-- Allow public deletes to the 'campaigns' bucket
create policy "Public Delete campaigns"
on storage.objects for delete
to public
using ( bucket_id = 'campaigns' );
