import { NextResponse, type NextRequest } from 'next/server';

const maintenancePage = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>メンテナンス中 | ルームシェアmikke</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 1.25rem; background: #fcfbf7; color: #292421; font-family: system-ui, sans-serif; }
    main { width: min(100%, 34rem); padding: clamp(1.5rem, 6vw, 3rem); background: white; border: 1px solid #e9e3db; border-radius: 1rem; }
    p { margin: 0; line-height: 1.8; }
    .brand { color: #a50000; font-weight: 700; }
    h1 { margin: .75rem 0 1rem; font-size: clamp(1.5rem, 5vw, 2rem); }
    p + p { margin-top: .75rem; }
  </style>
</head>
<body>
  <main>
    <p class="brand">ルームシェアmikke</p>
    <h1>ただいまメンテナンス中です</h1>
    <p>現在、物件情報の閲覧などをご利用いただけません。</p>
    <p>ご不便をおかけしますが、時間をおいて再度アクセスしてください。</p>
  </main>
</body>
</html>`;

export function proxy(request: NextRequest) {
    if (process.env.SITE_MAINTENANCE_MODE === 'off') {
        return NextResponse.next();
    }

    return new NextResponse(request.method === 'HEAD' ? null : maintenancePage, {
        status: 503,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-store',
            'Retry-After': '3600',
        },
    });
}

export const config = {
    matcher: '/((?!api(?:/|$)|_next(?:/|$)|privacy(?:/|$)|terms(?:/|$)|company(?:/|$)|.*\\.[^/]+$).*)',
};
