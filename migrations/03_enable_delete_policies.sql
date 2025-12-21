-- Enable DELETE policies for room_requests and giveaways
-- This allows users to delete their own records

create policy "Users can delete their own room requests." on public.room_requests
  for delete using (auth.uid() = user_id);

create policy "Users can delete their own giveaways." on public.giveaways
  for delete using (auth.uid() = user_id);
