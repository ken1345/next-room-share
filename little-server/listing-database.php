<?php

declare(strict_types=1);

function listingDatabase(): PDO
{
    $passwordPath = dirname(__DIR__) . '/db-password';
    $password = file_get_contents($passwordPath);
    if ($password === false || $password === '') {
        throw new RuntimeException('Database password is unavailable.');
    }

    return new PDO(
        'mysql:host=db01.lsv.jp;dbname=dfofox898s;charset=utf8mb4',
        'dfofox',
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_TIMEOUT => 5]
    );
}
