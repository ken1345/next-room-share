-- 5. Room Requests Table (People looking for rooms)
create table public.room_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  title text not null,
  budget_min integer,
  budget_max integer,
  area text,
  move_in_date date,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Room Requests
alter table public.room_requests enable row level security;

create policy "Room requests are viewable by everyone." on public.room_requests
  for select using (true);

create policy "Users can insert their own room requests." on public.room_requests
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own room requests." on public.room_requests
  for update using (auth.uid() = user_id);

-- 6. Giveaways Table (People giving away things/rooms)
create table public.giveaways (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  title text not null,
  description text,
  image_url text, 
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Giveaways
alter table public.giveaways enable row level security;

create policy "Giveaways are viewable by everyone." on public.giveaways
  for select using (true);

create policy "Users can insert their own giveaways." on public.giveaways
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own giveaways." on public.giveaways
  for update using (auth.uid() = user_id);
