-- Storage buckets and cleanup
insert into
  storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('uploads', 'uploads', false),
  ('outputs', 'outputs', false)
on conflict (id) do nothing;

create policy avatars_public_read on storage.objects for
select
  using (bucket_id = 'avatars');

create policy avatars_owner_write on storage.objects for insert
with
  check (
    bucket_id = 'avatars'
    and (storage.foldername (name)) [1] = auth.uid ()::text
  );

create policy uploads_owner_read on storage.objects for
select
  using (
    bucket_id = 'uploads'
    and (storage.foldername (name)) [1] = auth.uid ()::text
  );

create policy uploads_owner_write on storage.objects for insert
with
  check (
    bucket_id = 'uploads'
    and (storage.foldername (name)) [1] = auth.uid ()::text
  );

create policy outputs_owner_read on storage.objects for
select
  using (
    bucket_id = 'outputs'
    and (storage.foldername (name)) [1] = auth.uid ()::text
  );

create or replace function public.cleanup_expired_assets () returns void language plpgsql security definer
set
  search_path = public as $$
declare
  g record;
begin
  for g in
    select id, output_asset_id, user_id
    from generations
    where expires_at is not null and expires_at < now()
  loop
    delete from storage.objects
    where bucket_id in ('outputs', 'uploads')
      and (storage.foldername(name))[1] = g.user_id::text
      and (name like '%' || g.id::text || '%');
    update generations set output_asset_id = null where id = g.id;
    delete from assets where id = g.output_asset_id;
    delete from generations where id = g.id;
  end loop;
end;
$$;
