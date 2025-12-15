-- Drop the incorrect foreign key referencing auth.users
alter table public.before_after_posts
drop constraint if exists before_after_posts_user_id_fkey;

-- Add the correct foreign key referencing public.users
alter table public.before_after_posts
add constraint before_after_posts_user_id_fkey
foreign key (user_id)
references public.users (id)
on delete cascade;
