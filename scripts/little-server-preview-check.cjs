const assert = require('node:assert/strict');
(async () => {
    const token = process.env.LITTLE_SERVER_LISTINGS_TOKEN;
    assert.ok(token, 'Preview API token is missing');
    const response = await fetch('https://dfofox.lsv.jp/roommikke-api/listings.php', {
        headers: { 'X-Roommikke-Token': token },
        redirect: 'error',
        signal: AbortSignal.timeout(10000),
    });
    assert.equal(response.status, 200, 'Little Server API did not respond successfully');
    const { listings } = await response.json();
    assert.ok(Array.isArray(listings) && listings.length > 0);
    assert.ok(listings.every(listing => listing.is_public === true));
    console.log('LITTLE_SERVER_PREVIEW_OK public_listings=' + listings.length);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
