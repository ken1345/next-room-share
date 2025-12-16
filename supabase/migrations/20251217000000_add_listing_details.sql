-- Add building_type and equipment columns to listings table

ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS building_type text,
ADD COLUMN IF NOT EXISTS equipment text[]; -- using array for multiple selection
