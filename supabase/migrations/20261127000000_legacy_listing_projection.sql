-- Install the service-only projection before enabling it at cutover.
begin;

create function public.project_little_server_listing(listing_data jsonb)
returns boolean
language sql
set search_path = ''
as $$
    with input as (
        select * from jsonb_populate_record(null::public.listings, listing_data)
    ), applied as (
        insert into public.listings as existing (
            id, host_id, title, description, price, address, latitude, longitude,
            prefecture, city, station_line, station_name, minutes_to_station, room_type,
            gender_restriction, building_type, slug, slug_jp, amenities, equipment,
            personal_equipment, images, is_public, created_at, updated_at
        )
        select
            id, host_id, title, description, price, address, latitude, longitude,
            prefecture, city, station_line, station_name, minutes_to_station, room_type,
            gender_restriction, building_type, slug, slug_jp, amenities, equipment,
            personal_equipment, images, coalesce(is_public, false), created_at, updated_at
        from input
        on conflict (id) do update set
            title = excluded.title, description = excluded.description, price = excluded.price,
            address = excluded.address, latitude = excluded.latitude, longitude = excluded.longitude,
            prefecture = excluded.prefecture, city = excluded.city, station_line = excluded.station_line,
            station_name = excluded.station_name, minutes_to_station = excluded.minutes_to_station,
            room_type = excluded.room_type, gender_restriction = excluded.gender_restriction,
            building_type = excluded.building_type, slug = excluded.slug, slug_jp = excluded.slug_jp,
            amenities = excluded.amenities, equipment = excluded.equipment,
            personal_equipment = excluded.personal_equipment, images = excluded.images,
            is_public = excluded.is_public, updated_at = excluded.updated_at
        where existing.host_id = excluded.host_id
        returning id
    )
    select exists (select 1 from applied);
$$;

revoke all on function public.project_little_server_listing(jsonb) from public, anon, authenticated;
grant execute on function public.project_little_server_listing(jsonb) to service_role;

commit;
