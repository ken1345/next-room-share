-- Seed Listings with Location (if they don't exist or update existing ones)
-- We'll just insert new ones for simplicity to guarantee we have map points.

-- Tokyo
INSERT INTO public.listings (title, description, price, address, latitude, longitude, host_id, amenities)
VALUES
('Sunny Share House Tokyo', 'A bright and sunny share house in the heart of Tokyo.', 65000, 'Shibuya, Tokyo', 35.6585805, 139.7016429, (SELECT id FROM auth.users LIMIT 1), ARRAY['Wifi', 'Kitchen']),
('Green House Setagaya', 'Surrounded by parks and greenery.', 55000, 'Setagaya, Tokyo', 35.646572, 139.653247, (SELECT id FROM auth.users LIMIT 1), ARRAY['Garden', 'Parking']);

-- Kyoto
INSERT INTO public.listings (title, description, price, address, latitude, longitude, host_id, amenities)
VALUES
('Traditional Kyoto Machiya', 'Experience traditional living.', 45000, 'Kyoto City', 35.011636, 135.768029, (SELECT id FROM auth.users LIMIT 1), ARRAY['Tatami', 'Shared Bath']);

-- Osaka
INSERT INTO public.listings (title, description, price, address, latitude, longitude, host_id, amenities)
VALUES
('Osaka Foodie House', 'Near Dotonbori.', 40000, 'Osaka City', 34.693737, 135.502165, (SELECT id FROM auth.users LIMIT 1), ARRAY['Kitchen', 'Bicycle']);

-- Hokkaido
INSERT INTO public.listings (title, description, price, address, latitude, longitude, host_id, amenities)
VALUES
('Snowy Lodge Sapporo', 'Great for ski lovers.', 35000, 'Sapporo', 43.062096, 141.354376, (SELECT id FROM auth.users LIMIT 1), ARRAY['Heating', 'Ski Storage']);

-- Okinawa
INSERT INTO public.listings (title, description, price, address, latitude, longitude, host_id, amenities)
VALUES
('Beachfront Villa', 'Walk to the sea.', 50000, 'Naha', 26.212401, 127.680932, (SELECT id FROM auth.users LIMIT 1), ARRAY['AC', 'Surfboard Storage']);


-- Seed Reviews
-- We need to fetch the IDs of these inserted listings to link reviews.
-- Since we can't easily do that in a simple script repeatedly without logic,
-- we'll assume we are running this once or use a DO block.

DO $$
DECLARE
    tokyo_id uuid;
    kyoto_id uuid;
    osaka_id uuid;
    hokkaido_id uuid;
    okinawa_id uuid;
    user_id uuid;
BEGIN
    SELECT id INTO user_id FROM auth.users LIMIT 1;
    
    SELECT id INTO tokyo_id FROM public.listings WHERE title = 'Sunny Share House Tokyo' LIMIT 1;
    SELECT id INTO kyoto_id FROM public.listings WHERE title = 'Traditional Kyoto Machiya' LIMIT 1;
    SELECT id INTO osaka_id FROM public.listings WHERE title = 'Osaka Foodie House' LIMIT 1;
    SELECT id INTO hokkaido_id FROM public.listings WHERE title = 'Snowy Lodge Sapporo' LIMIT 1;
    SELECT id INTO okinawa_id FROM public.listings WHERE title = 'Beachfront Villa' LIMIT 1;

    IF tokyo_id IS NOT NULL THEN
        INSERT INTO public.reviews (listing_id, user_id, rating, comment) VALUES
        (tokyo_id, user_id, 5, 'Really convenient location! Love the people here.'),
        (tokyo_id, user_id, 4, 'A bit noisy but great vibe.');
    END IF;

    IF kyoto_id IS NOT NULL THEN
        INSERT INTO public.reviews (listing_id, user_id, rating, comment) VALUES
        (kyoto_id, user_id, 5, 'Beautiful traditional house. Very peaceful.');
    END IF;

    IF osaka_id IS NOT NULL THEN
        INSERT INTO public.reviews (listing_id, user_id, rating, comment) VALUES
        (osaka_id, user_id, 4, 'Food nearby is amazing. House is clean.');
    END IF;
    
    IF hokkaido_id IS NOT NULL THEN
        INSERT INTO public.reviews (listing_id, user_id, rating, comment) VALUES
        (hokkaido_id, user_id, 5, 'Warm and cozy even in winter.');
    END IF;

    IF okinawa_id IS NOT NULL THEN
        INSERT INTO public.reviews (listing_id, user_id, rating, comment) VALUES
        (okinawa_id, user_id, 5, 'Best view ever! Want to live here forever.');
    END IF;
END $$;
