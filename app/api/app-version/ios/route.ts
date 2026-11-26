export function GET() {
    const configured = process.env.MIKKE_MINIMUM_IOS_VERSION;
    const minimum_supported_version = configured && /^\d+\.\d+\.\d+$/.test(configured) ? configured : '0.0.0';
    return Response.json({ minimum_supported_version }, { headers: { 'Cache-Control': 'no-store' } });
}
