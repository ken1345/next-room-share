-- Fix Cascade Delete for Favorites

-- 1. Favorites Table
ALTER TABLE public.favorites
DROP CONSTRAINT IF EXISTS favorites_listing_id_fkey;

ALTER TABLE public.favorites
ADD CONSTRAINT favorites_listing_id_fkey
FOREIGN KEY (listing_id)
REFERENCES public.listings(id)
ON DELETE CASCADE;
