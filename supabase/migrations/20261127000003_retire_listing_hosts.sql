-- Install before switching the live catalog to Little Server.
begin;

create table public.listing_retired_hosts (
    host_id uuid primary key,
    retired_at timestamptz not null default now()
);
alter table public.listing_retired_hosts enable row level security;
revoke all on public.listing_retired_hosts from public, anon, authenticated;
grant select, insert on public.listing_retired_hosts to service_role;

create function public.record_deleted_listing_host()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.listing_retired_hosts (host_id) values (old.id)
    on conflict (host_id) do nothing;
    return old;
end;
$$;
revoke all on function public.record_deleted_listing_host() from public, anon, authenticated;
create trigger record_deleted_listing_host
    after delete on auth.users for each row execute function public.record_deleted_listing_host();

commit;
