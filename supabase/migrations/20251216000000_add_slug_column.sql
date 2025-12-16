-- Add slug column to listings table
ALTER TABLE listings ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS slug_jp text;

-- Optional: Create index for faster lookups if you plan to search by slug
CREATE INDEX IF NOT EXISTS idx_listings_slug ON listings(slug);
