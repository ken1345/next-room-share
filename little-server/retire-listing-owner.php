<?php

declare(strict_types=1);

function lockListingOwner(PDO $database, string $owner): void
{
    $lock = $database->prepare('SELECT GET_LOCK(?, 5)');
    $lock->execute(['roommikke:listing-owner:' . $owner]);
    if ((int) $lock->fetchColumn() !== 1) {
        throw new RuntimeException('Listing owner is busy');
    }
}

function isRetiredListingOwner(PDO $database, string $owner): bool
{
    $query = $database->prepare('SELECT 1 FROM listing_retired_hosts WHERE host_id = ?');
    $query->execute([$owner]);
    return $query->fetchColumn() !== false;
}

function retireListingOwner(PDO $database, string $owner): void
{
    $database->beginTransaction();
    $retire = $database->prepare('INSERT IGNORE INTO listing_retired_hosts (host_id) VALUES (?)');
    $retire->execute([$owner]);
    $delete = $database->prepare('DELETE FROM listings WHERE host_id = ?');
    $delete->execute([$owner]);
    $database->commit();
}
