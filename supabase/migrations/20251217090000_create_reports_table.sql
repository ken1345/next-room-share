-- Create reports table
create table if not exists public.reports (
    id uuid not null default gen_random_uuid(),
    listing_id uuid not null referenceS public.listings(id) on delete cascade,
    reporter_id uuid references auth.users(id),
    reason text not null,
    description text,
    created_at timestamp with time zone not null default now(),
    status text not null default 'pending', -- pending, reviewed, resolved
    constraint reports_pkey primary key (id)
);

-- Enable RLS
alter table public.reports enable row level security;

-- Policies

-- 1. Users can create reports
create policy "Users can create reports"
    on public.reports
    for insert
    to authenticated
    with check (true);

-- 2. Users can view their own reports (Optional, but good for history if implemented)
create policy "Users can view own reports"
    on public.reports
    for select
    to authenticated
    using (auth.uid() = reporter_id);

-- Note: Admins would need a separate policy or service role access
