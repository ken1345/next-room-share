<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, mixed $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
    exit;
}

function validId(mixed $id): bool
{
    return is_string($id) && preg_match('/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/D', $id) === 1;
}

function listingResponse(array $listing, bool $ownerView, string $mediaFolder): array
{
    foreach (['amenities', 'equipment', 'personal_equipment', 'images'] as $field) {
        $listing[$field] = $listing[$field] === null ? null : json_decode($listing[$field], true, 512, JSON_THROW_ON_ERROR);
    }
    if (!$ownerView) {
        $listing['images'] = array_values(array_filter(
            $listing['images'] ?? [],
            static fn ($url): bool => is_string($url)
                && preg_match('~^https://dfofox\.lsv\.jp/' . $mediaFolder . '/[a-f0-9]{48}\.(?:jpg|png|webp)$~D', $url) === 1,
        ));
    }
    foreach (['created_at', 'updated_at'] as $field) {
        if ($listing[$field] !== null) {
            $listing[$field] = str_replace(' ', 'T', $listing[$field]) . 'Z';
        }
    }
    if ($listing['is_public'] !== null) {
        $listing['is_public'] = (bool) $listing['is_public'];
    }
    return $listing;
}

function listingValues(array $input): array
{
    $textLimits = [
        'title' => 300, 'description' => 20000, 'address' => 500,
        'prefecture' => 100, 'city' => 150, 'station_line' => 500, 'station_name' => 500,
        'room_type' => 80, 'gender_restriction' => 80, 'building_type' => 500,
        'slug' => 500, 'slug_jp' => 500,
    ];
    $arrays = ['amenities', 'equipment', 'personal_equipment', 'images'];
    $values = [];
    foreach ($input as $field => $value) {
        if (isset($textLimits[$field])) {
            $valid = is_string($value) && mb_strlen($value) <= $textLimits[$field]
                && ($field !== 'title' || trim($value) !== '');
            if (!$valid && !($value === null && $field !== 'title')) {
                respond(400, ['error' => 'Invalid ' . $field]);
            }
        } elseif (in_array($field, $arrays, true)) {
            if ($value !== null) {
                if (!is_array($value) || !array_is_list($value) || count($value) > 100) {
                    respond(400, ['error' => 'Invalid ' . $field]);
                }
                foreach ($value as $item) {
                    if (!is_string($item) || strlen($item) > 2048
                        || ($field === 'images' && !preg_match('~^https://~i', $item))) {
                        respond(400, ['error' => 'Invalid ' . $field]);
                    }
                }
                $value = json_encode($value, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
            }
        } elseif ($field === 'price' || $field === 'minutes_to_station') {
            if (!(is_int($value) && $value >= 0 && $value <= 2147483647)
                && !($value === null && $field === 'minutes_to_station')) {
                respond(400, ['error' => 'Invalid ' . $field]);
            }
        } elseif ($field === 'latitude' || $field === 'longitude') {
            $limit = $field === 'latitude' ? 90 : 180;
            if ($value !== null && ((!is_int($value) && !is_float($value)) || abs($value) > $limit)) {
                respond(400, ['error' => 'Invalid ' . $field]);
            }
        } elseif ($field === 'is_public') {
            if (!is_bool($value)) {
                respond(400, ['error' => 'Invalid visibility']);
            }
            $value = (int) $value;
        } else {
            respond(400, ['error' => 'Unsupported listing field']);
        }
        $values[$field] = $value;
    }
    return $values;
}

function saveListingPhoto(string $mediaFolder, string $privateDirectory): never
{
    $limit = 3 * 1024 * 1024;
    $contents = file_get_contents('php://input', false, null, 0, $limit + 1);
    if ($contents === false || strlen($contents) > $limit) {
        respond(413, ['error' => 'Image is too large']);
    }
    $directory = dirname(__DIR__) . '/' . $mediaFolder;
    if (!is_dir($directory) && !mkdir($directory, 0755) && !is_dir($directory)) {
        throw new RuntimeException('Listing image storage unavailable');
    }
    require $privateDirectory . '/listing-migration/listing-image.php';
    $input = tempnam($privateDirectory, 'upload-');
    $output = tempnam($privateDirectory, 'webp-');
    $filename = bin2hex(random_bytes(24)) . '.webp';
    try {
        if ($input === false || $output === false || file_put_contents($input, $contents) !== strlen($contents)) {
            throw new RuntimeException('Could not stage image');
        }
        $converted = encodeListingPhotoAsWebp($input, $output);
        if ($converted && (!chmod($output, 0644) || !rename($output, $directory . '/' . $filename))) {
            throw new RuntimeException('Could not save WebP image');
        }
    } finally {
        foreach ([$input, $output] as $path) {
            if ($path !== false && is_file($path)) {
                unlink($path);
            }
        }
    }
    if (!$converted) {
        respond(400, ['error' => 'Invalid image']);
    }
    respond(201, ['url' => 'https://dfofox.lsv.jp/' . $mediaFolder . '/' . $filename]);
}

$privateDirectory = dirname(__DIR__, 2) . '/.roommikke';
$secret = @file_get_contents($privateDirectory . '/listing-api-token');
$testSecret = @file_get_contents($privateDirectory . '/listing-device-test-token');
$providedToken = $_SERVER['HTTP_X_ROOMMIKKE_TOKEN'] ?? '';
$deviceTest = $testSecret !== false && strlen($testSecret) >= 32 && hash_equals($testSecret, $providedToken);
if (!$deviceTest && ($secret === false || strlen($secret) < 32 || !hash_equals($secret, $providedToken))) {
    respond(401, ['error' => 'Unauthorized']);
}
$table = $deviceTest ? 'listings_device_test' : 'listings';
$mediaFolder = $deviceTest ? 'roommikke-device-test-images' : 'roommikke-listing-images';
$projectLegacyCatalog = !$deviceTest && ($_SERVER['HTTP_X_ROOMMIKKE_PROJECT_LEGACY'] ?? '') === '1';

$id = $_GET['id'] ?? null;
$owner = $_SERVER['HTTP_X_ROOMMIKKE_OWNER'] ?? null;
if (($id !== null && !validId($id)) || ($owner !== null && !validId($owner))) {
    respond(400, ['error' => 'Invalid listing or owner ID']);
}

try {
    require $privateDirectory . '/listing-migration/listing-database.php';
    $db = listingDatabase();
    if ($projectLegacyCatalog) {
        require $privateDirectory . '/listing-migration/listing-projection.php';
    }
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $criteria = $owner === null ? 'is_public = 1' : 'host_id = ?';
        $args = $owner === null ? [] : [$owner];
        if ($id !== null) {
            $criteria .= ' AND id = ?';
            $args[] = $id;
        }
        $page = filter_var($_GET['page'] ?? 1, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 100000]]);
        if ($page === false) {
            respond(400, ['error' => 'Invalid page']);
        }
        $offset = ($page - 1) * 100;
        $query = $db->prepare("SELECT * FROM $table WHERE " . $criteria
            . ' ORDER BY updated_at DESC, id LIMIT 100 OFFSET ' . $offset);
        $query->execute($args);
        $listings = array_map(static fn (array $listing) => listingResponse($listing, $owner !== null, $mediaFolder), $query->fetchAll(PDO::FETCH_ASSOC));
        respond(200, ['listings' => $listings]);
    }

    if ($owner === null) {
        respond(401, ['error' => 'Unauthorized']);
    }

    $retireOwner = !$deviceTest && $method === 'POST' && ($_GET['retire_owner'] ?? null) === '1' && $id === null;
    if ($retireOwner || $projectLegacyCatalog) {
        require $privateDirectory . '/listing-migration/retire-listing-owner.php';
        lockListingOwner($db, $owner);
        if ($retireOwner) {
            retireListingOwner($db, $owner);
            respond(200, ['retired' => true]);
        }
        if (isRetiredListingOwner($db, $owner)) {
            respond(403, ['error' => 'Listing owner account has been withdrawn']);
        }
    }

    if ($method === 'POST' && ($_GET['upload'] ?? null) === '1') {
        saveListingPhoto($mediaFolder, $privateDirectory);
    }

    if ($method === 'DELETE' && $id !== null) {
        if ($projectLegacyCatalog) {
            $db->beginTransaction();
            $lock = $db->prepare("SELECT id FROM $table WHERE id = ? AND host_id = ? FOR UPDATE");
            $lock->execute([$id, $owner]);
            if ($lock->fetchColumn() === false) {
                $db->rollBack();
                respond(404, ['deleted' => false]);
            }
            publishLegacyListing($db, $providedToken, $id, $owner, true);
        }
        $delete = $db->prepare("DELETE FROM $table WHERE id = ? AND host_id = ?");
        $delete->execute([$id, $owner]);
        if ($projectLegacyCatalog) {
            $db->commit();
            header('X-Roommikke-Legacy-Projected: 1');
        }
        respond($delete->rowCount() === 1 ? 200 : 404, ['deleted' => $delete->rowCount() === 1]);
    }

    if ($method === 'PATCH' && $id !== null && ($_GET['bump'] ?? null) === '1') {
        if ($projectLegacyCatalog) $db->beginTransaction();
        $bump = $db->prepare("UPDATE $table SET updated_at = UTC_TIMESTAMP(6)
            WHERE id = ? AND host_id = ? AND (updated_at IS NULL OR updated_at <= UTC_TIMESTAMP(6) - INTERVAL 72 HOUR)");
        $bump->execute([$id, $owner]);
        if ($projectLegacyCatalog) {
            if ($bump->rowCount() === 1) publishLegacyListing($db, $providedToken, $id, $owner);
            $db->commit();
            header('X-Roommikke-Legacy-Projected: 1');
        }
        respond($bump->rowCount() === 1 ? 200 : 409, ['id' => $id]);
    }

    if (!in_array($method, ['POST', 'PATCH'], true) || $id === null) {
        respond(405, ['error' => 'Method not allowed']);
    }
    $body = file_get_contents('php://input', false, null, 0, 131073);
    if ($body === false || strlen($body) > 131072) {
        respond(413, ['error' => 'Listing data too large']);
    }
    $input = json_decode($body, true);
    if (!is_array($input) || $input === [] || array_is_list($input)) {
        respond(400, ['error' => 'Invalid listing data']);
    }
    $values = listingValues($input);

    if ($method === 'POST') {
        if (!isset($values['title'], $values['price'])) {
            respond(400, ['error' => 'Title and price are required']);
        }
        $fields = implode(', ', array_keys($values));
        $parameters = implode(', ', array_fill(0, count($values), '?'));
        $insert = $db->prepare("INSERT INTO $table (id, host_id, created_at, updated_at, $fields)
            VALUES (?, ?, UTC_TIMESTAMP(6), UTC_TIMESTAMP(6), $parameters)");
        if ($projectLegacyCatalog) $db->beginTransaction();
        $insert->execute([$id, $owner, ...array_values($values)]);
        if ($projectLegacyCatalog) {
            publishLegacyListing($db, $providedToken, $id, $owner);
            $db->commit();
            header('X-Roommikke-Legacy-Projected: 1');
        }
        respond(201, ['id' => $id]);
    }

    $assignments = implode(', ', array_map(static fn (string $field): string => $field . ' = ?', array_keys($values)));
    $update = $db->prepare("UPDATE $table SET $assignments, updated_at = UTC_TIMESTAMP(6) WHERE id = ? AND host_id = ?");
    if ($projectLegacyCatalog) $db->beginTransaction();
    $update->execute([...array_values($values), $id, $owner]);
    if ($projectLegacyCatalog) {
        if ($update->rowCount() === 1) publishLegacyListing($db, $providedToken, $id, $owner);
        $db->commit();
        header('X-Roommikke-Legacy-Projected: 1');
    }
    respond($update->rowCount() === 1 ? 200 : 404, ['id' => $id]);
} catch (PDOException $error) {
    if (isset($db) && $db->inTransaction()) $db->rollBack();
    if ($error->getCode() === '23000') {
        respond(409, ['error' => 'Listing already exists']);
    }
    error_log('Roommikke listing database operation failed');
    respond(503, ['error' => 'Listing service unavailable']);
} catch (Throwable $error) {
    if (isset($db) && $db->inTransaction()) $db->rollBack();
    error_log('Roommikke listing service failed');
    respond(503, ['error' => 'Listing service unavailable']);
}
