-- Apply at cutover, after verifying the current public catalog and chat joins.
-- Legacy detail URLs can query by ID without a visibility filter.
create policy legacy_listing_visibility
    on public.listings as restrictive for select to anon, authenticated
    using (is_public is true or host_id = (select auth.uid()));
