<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require __DIR__ . '/listing-database.php';

$columns = [
    'id', 'host_id', 'title', 'description', 'price', 'address', 'latitude',
    'longitude', 'prefecture', 'city', 'station_line', 'station_name',
    'minutes_to_station', 'room_type', 'gender_restriction', 'is_public',
    'view_count', 'favorites_count', 'inquiry_count', 'slug', 'slug_jp',
    'building_type', 'amenities', 'images', 'equipment', 'personal_equipment',
    'created_at', 'updated_at',
];
$arrayColumns = ['amenities', 'images', 'equipment', 'personal_equipment'];
$dateColumns = ['created_at', 'updated_at'];

try {
    $rows = json_decode(stream_get_contents(STDIN), true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($rows) || !array_is_list($rows) || $rows === []) {
        throw new RuntimeException('Expected a nonempty listing export.');
    }

    $database = listingDatabase();
    $database->beginTransaction();
    $placeholders = implode(', ', array_fill(0, count($columns), '?'));
    $insert = $database->prepare(
        'INSERT INTO listings (' . implode(', ', $columns) . ') VALUES (' . $placeholders . ')'
    );

    foreach ($rows as $row) {
        $values = [];
        foreach ($columns as $column) {
            if (!array_key_exists($column, $row)) {
                throw new RuntimeException('Listing export is missing ' . $column . '.');
            }
            $value = $row[$column];
            if ($column === 'is_public' && $value !== null) {
                $value = (int) ($value === true);
            } elseif ($value !== null && in_array($column, $arrayColumns, true)) {
                $value = json_encode($value, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
            } elseif ($value !== null && in_array($column, $dateColumns, true)) {
                $value = (new DateTimeImmutable($value))->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d H:i:s.u');
            }
            $values[] = $value;
        }
        $insert->execute($values);
    }

    $database->commit();
    echo 'Imported listings: ', count($rows), PHP_EOL;
} catch (Throwable $error) {
    if (isset($database) && $database->inTransaction()) {
        $database->rollBack();
    }
    fwrite(STDERR, 'Listing import failed (' . get_class($error) . ').' . PHP_EOL);
    exit(1);
}
