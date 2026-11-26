alter table public.ios_push_devices
    drop constraint if exists ios_push_devices_token_check,
    add constraint ios_push_devices_token_check
        check (char_length(token) between 32 and 512 and token !~ '[^0-9a-f]');
