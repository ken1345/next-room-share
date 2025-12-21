-- Add request_id and giveaway_id to threads table
ALTER TABLE threads ADD COLUMN IF NOT EXISTS request_id UUID REFERENCES room_requests(id) ON DELETE CASCADE;
ALTER TABLE threads ADD COLUMN IF NOT EXISTS giveaway_id UUID REFERENCES giveaways(id) ON DELETE CASCADE;
