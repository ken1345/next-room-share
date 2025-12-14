-- Add is_public column to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Update existing rows to be public by default
UPDATE listings SET is_public = true WHERE is_public IS NULL;
