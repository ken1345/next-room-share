-- Run only during the cutover write freeze after the replacement API is ready.
begin;

create function public.require_current_listing_client()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if current_user in ('anon', 'authenticated') then
        raise exception using
            errcode = 'P0001',
            message = '物件の登録・編集には最新版のアプリが必要です。App StoreまたはGoogle Playからアップデートしてください。';
    end if;
    return null;
end;
$$;

create trigger require_current_listing_client
    before insert or update or delete on public.listings
    for each statement execute function public.require_current_listing_client();

create policy stop_legacy_listing_photo_insert on storage.objects
    as restrictive for insert to anon, authenticated
    with check (not (bucket_id = 'images' and name like 'listings/%'));
create policy stop_legacy_listing_photo_update on storage.objects
    as restrictive for update to anon, authenticated
    using (not (bucket_id = 'images' and name like 'listings/%'))
    with check (not (bucket_id = 'images' and name like 'listings/%'));
create policy stop_legacy_listing_photo_delete on storage.objects
    as restrictive for delete to anon, authenticated
    using (not (bucket_id = 'images' and name like 'listings/%'));

commit;
