-- Add detailed columns to listings table for accurate filtering
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS prefecture text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS station_line text,
ADD COLUMN IF NOT EXISTS station_name text,
ADD COLUMN IF NOT EXISTS minutes_to_station integer,
ADD COLUMN IF NOT EXISTS room_type text, -- 'private', 'semi', 'shared'
ADD COLUMN IF NOT EXISTS gender_restriction text; -- 'any', 'male', 'female'

-- Comments for clarity
COMMENT ON COLUMN public.listings.prefecture IS 'Prefecture name (e.g. 東京都)';
COMMENT ON COLUMN public.listings.city IS 'City name (e.g. 渋谷区)';
COMMENT ON COLUMN public.listings.station_line IS 'Train line name (e.g. JR山手線)';
COMMENT ON COLUMN public.listings.station_name IS 'Station name (e.g. 渋谷駅)';
COMMENT ON COLUMN public.listings.minutes_to_station IS 'Walking distance in minutes';
COMMENT ON COLUMN public.listings.room_type IS 'Type of room: private, semi, shared';
