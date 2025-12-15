-- Add profile fields to users table
ALTER TABLE public.users
ADD COLUMN gender text,
ADD COLUMN age integer,
ADD COLUMN occupation text;

-- Check if they are added correctly (optional, for manual verification)
-- SELECT * FROM public.users LIMIT 1;
