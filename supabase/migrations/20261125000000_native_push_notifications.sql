create table public.ios_push_devices (
    installation_id uuid primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    token text not null check (token ~ '^[a-f0-9]{32,512}$'),
    topic text not null check (topic in ('jp.roommikke.webapp', 'jp.roommikke.webapp.preview')),
    environment text not null check (environment in ('development', 'production')),
    updated_at timestamptz not null default now()
);

create index ios_push_devices_user_idx on public.ios_push_devices (user_id);

create table public.ios_push_deliveries (
    message_id bigint not null references public.messages(id) on delete cascade,
    installation_id uuid not null references public.ios_push_devices(installation_id) on delete cascade,
    primary key (message_id, installation_id)
);

alter table public.ios_push_devices enable row level security;
alter table public.ios_push_deliveries enable row level security;
revoke all on public.ios_push_devices, public.ios_push_deliveries from public, anon, authenticated;
grant select, insert, update, delete on public.ios_push_devices, public.ios_push_deliveries to service_role;
