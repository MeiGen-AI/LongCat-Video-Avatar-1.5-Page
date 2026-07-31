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
  a record;
begin
  for g in
    select id, output_asset_id, image_asset_id, audio_asset_id
    from generations
    where expires_at is not null and expires_at < now()
  loop
    for a in
      select id, bucket, path
      from assets
      where id in (g.output_asset_id, g.image_asset_id, g.audio_asset_id)
    loop
      if not exists (
        select 1
        from generations other
        where other.id <> g.id
          and (
            other.image_asset_id = a.id
            or other.audio_asset_id = a.id
            or other.output_asset_id = a.id
          )
      ) then
        delete from storage.objects
        where bucket_id = a.bucket
          and name = a.path;
      end if;
    end loop;
    update generations set output_asset_id = null where id = g.id;
    delete from generations where id = g.id;
    delete from assets
    where id in (g.output_asset_id, g.image_asset_id, g.audio_asset_id)
      and not exists (
        select 1
        from generations other
        where other.image_asset_id = assets.id
          or other.audio_asset_id = assets.id
          or other.output_asset_id = assets.id
      );
  end loop;
end;
$$;
