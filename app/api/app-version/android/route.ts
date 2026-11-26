export function GET() {
    const configured = Number(process.env.MIKKE_MINIMUM_ANDROID_VERSION_CODE);
    const minimumVersionCode = Number.isSafeInteger(configured) && configured >= 0 ? configured : 0;
    return Response.json({ minimumVersionCode }, { headers: { 'Cache-Control': 'no-store' } });
}
