-- Add personal_equipment column to listings table
ALTER TABLE listings 
ADD COLUMN personal_equipment text[] DEFAULT '{}';

COMMENT ON COLUMN listings.personal_equipment IS 'Equipment available in the private room (e.g., Bed, Desk, AC)';
