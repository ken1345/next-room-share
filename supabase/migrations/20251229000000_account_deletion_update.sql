-- 1. Ensure Archive Table Exists
create table if not exists public.account_archives (
  id uuid default gen_random_uuid() primary key,
  original_user_id uuid,
  email text,
  display_name text,
  backup_data jsonb,
  archived_at timestamp with time zone default now()
);

-- Secure the archive table (Admins only)
alter table public.account_archives enable row level security;

-- 2. Define the Delete Function
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_email text;
  v_display_name text;
  v_backup_json jsonb;
begin
  v_user_id := auth.uid();
  
  -- Get User Info
  select email into v_email from auth.users where id = v_user_id;
  select display_name into v_display_name from public.users where id = v_user_id;

  -- Create Backup JSON
  select json_build_object(
    'profile', (select row_to_json(u) from public.users u where id = v_user_id),
    'listings', (select json_agg(l) from public.listings l where host_id = v_user_id),
    'requests', (select json_agg(r) from public.room_requests r where user_id = v_user_id),
    'giveaways', (select json_agg(g) from public.giveaways g where user_id = v_user_id)
  ) into v_backup_json;

  -- Insert into Archive
  insert into public.account_archives (original_user_id, email, display_name, backup_data)
  values (v_user_id, v_email, v_display_name, v_backup_json);

  -- Delete Account
  delete from auth.users where id = v_user_id;
end;
$$;
