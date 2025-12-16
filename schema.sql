-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table (Public Profile)
-- Note: Supabase handles Auth in auth.users. This table is for public profile data.
create table public.users (
  id uuid references auth.users not null primary key,
  display_name text,
  email text,
  photo_url text, -- To replace Firebase's photoURL
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security
alter table public.users enable row level security;

-- Policies for Users
-- Anyone can view profiles
create policy "Public profiles are viewable by everyone." on public.users
  for select using (true);

-- Users can insert their own profile (hooked usually, but for client-side creation)
create policy "Users can insert their own profile." on public.users
  for insert with check (auth.uid() = id);

-- Users can update own profile
create policy "Users can update own profile." on public.users
  for update using (auth.uid() = id);

-- 2. Stories Table
create table public.stories (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  cover_image text,
  excerpt text,
  tags text[],
  author_id uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.stories enable row level security;

-- Policies for Stories
create policy "Stories are viewable by everyone." on public.stories
  for select using (true);

create policy "Users can insert their own stories." on public.stories
  for insert with check (auth.uid() = author_id);

create policy "Users can update their own stories." on public.stories
  for update using (auth.uid() = author_id);

-- 3. Listings Table (Rooms)
create table public.listings (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  price integer not null,
  address text,
  latitude float,
  longitude float,
  amenities text[],
  equipment text[],
  building_type text,
  images text[],
  host_id uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.listings enable row level security;

create policy "Listings are viewable by everyone." on public.listings
  for select using (true);

create policy "Hosts can insert listings." on public.listings
  for insert with check (auth.uid() = host_id);


-- 4. Storage Buckets (via storage.buckets - managed in SQL or Dashboard)
-- Insert a new bucket for profile images and story images
insert into storage.buckets (id, name, public) 
values ('images', 'images', true)
on conflict (id) do nothing;

-- Storage Policies
-- Allow public access to images
create policy "Public Access" on storage.objects for select
using ( bucket_id = 'images' );

-- Allow authenticated upload
create policy "Authenticated Upload" on storage.objects for insert
with check ( bucket_id = 'images' and auth.role() = 'authenticated' );

-- Allow owner update/delete (simplification)
create policy "Owner Update" on storage.objects for update
using ( bucket_id = 'images' and auth.uid() = owner );
