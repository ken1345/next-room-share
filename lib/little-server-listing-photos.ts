export const listingPhotosPending = process.env.NEXT_PUBLIC_LISTINGS_BACKEND === 'little-server';

export function isLittleServerListingPhoto(url: string): boolean {
    return /^https:\/\/dfofox\.lsv\.jp\/roommikke-listing-images\/[a-f0-9]{48}\.(jpg|png|webp)$/.test(url);
}
