<?php

declare(strict_types=1);

/**
 * Project a MariaDB write into the catalog used by legacy clients before
 * acknowledging completion. The caller holds the row lock until commit.
 */
function publishLegacyListing(PDO $database, string $token, string $id, string $owner, bool $retired = false): void
{
    $select = $database->prepare('SELECT * FROM listings WHERE id = ? AND host_id = ?');
    $select->execute([$id, $owner]);
    $row = $select->fetch(PDO::FETCH_ASSOC);
    if ($row === false) {
        throw new RuntimeException('Cannot project a missing listing');
    }

    $listing = listingResponse($row, true, 'roommikke-listing-images');
    if ($retired) {
        $listing['is_public'] = false;
    }
    $payload = json_encode($listing, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
    $request = curl_init('https://www.roommikke.jp/api/little-server/listings/projection');
    curl_setopt_array($request, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'X-Roommikke-Token: ' . $token],
        CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_CONNECTTIMEOUT => 3,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_RETURNTRANSFER => true,
    ]);
    $response = curl_exec($request);
    $status = curl_getinfo($request, CURLINFO_RESPONSE_CODE);
    curl_close($request);
    if ($response === false || $status !== 204) {
        throw new RuntimeException('Legacy listing projection failed');
    }
}
