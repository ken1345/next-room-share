export function getRoomUrl(id: string, pref?: string, city?: string) {
    // If pref and city are available, construct slug
    // e.g. /rooms/東京都-渋谷区-<UUID>
    // URL encoding is handled by Next.js/Browser usually, but we assume raw strings here 
    // and let Next/Link handle the href.

    // Note: If we really wanted "tokyo-shibuya", we would need a romanization map.
    // For now, Japanese slugs are valid and better than nothing.
    // To ensure clean URLs, we remove spaces.

    let slug = '';
    if (pref) slug += pref;
    if (city) slug += (slug ? '-' : '') + city;

    // If we have a slug, append it
    const cleanSlug = slug.replace(/\s+/g, '-'); // simple cleanup

    if (cleanSlug) {
        return `/rooms/${cleanSlug}-${id}`;
    }

    return `/rooms/${id}`;
}

export function extractIdFromSlug(slug: string) {
    // Extract the UUID from the end of the string
    // UUID format: 8-4-4-4-12 hex digits
    const match = slug.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
    return match ? match[0] : slug; // Fallback to returning original if no match (maybe it IS just an ID)
}
