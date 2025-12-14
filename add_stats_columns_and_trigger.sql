-- Add favorites_count and inquiry_count columns
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS favorites_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS inquiry_count INTEGER DEFAULT 0;

-- Backfill inquiry_count from existing threads
UPDATE listings l
SET inquiry_count = (SELECT COUNT(*) FROM threads t WHERE t.listing_id = l.id);

-- Function to maintain inquiry_count
CREATE OR REPLACE FUNCTION update_listing_inquiry_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE listings SET inquiry_count = inquiry_count + 1 WHERE id = NEW.listing_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE listings SET inquiry_count = inquiry_count - 1 WHERE id = OLD.listing_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update inquiry_count on thread changes
DROP TRIGGER IF EXISTS trigger_update_inquiry_count ON threads;
CREATE TRIGGER trigger_update_inquiry_count
AFTER INSERT OR DELETE ON threads
FOR EACH ROW EXECUTE FUNCTION update_listing_inquiry_count();
