begin;

-- Supabase Auth owns the account email. Keep the public column nullable so
-- older clients can still read and write profiles with the existing shape.
alter table public.users alter column email drop not null;
alter table public.users alter column email drop default;

create function public.clear_public_profile_email()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.email := null;
    return new;
end;
$$;

create trigger clear_public_profile_email
before insert or update on public.users
for each row execute function public.clear_public_profile_email();

update public.users set email = null where email is not null;

alter table public.users add constraint users_public_email_is_null check (email is null);
comment on column public.users.email is 'Legacy compatibility column. Account email is stored only in Supabase Auth.';

-- Some environments provision the contact table outside this repository.
do $$
begin
    if to_regclass('public.contacts') is not null then
        alter table public.contacts enable row level security;
        create policy contacts_block_client_reads on public.contacts
            as restrictive for select to anon, authenticated using (false);
    end if;
end;
$$;

commit;
