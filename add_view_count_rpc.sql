-- Add view_count column
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(listing_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE listings
  SET view_count = view_count + 1
  WHERE id = listing_id;
END;
$$;
