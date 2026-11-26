<?php

declare(strict_types=1);

const LISTING_PHOTO_MAX_EDGE = 1600;
const LISTING_PHOTO_WEBP_QUALITY = 80;

function encodeListingPhotoAsWebp(string $inputPath, string $outputPath): bool
{
    $info = @getimagesize($inputPath);
    if ($info === false || !in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP], true)
        || $info[0] < 1 || $info[1] < 1 || max($info[0], $info[1]) > 8000 || $info[0] * $info[1] > 32_000_000) {
        return false;
    }

    $image = match ($info[2]) {
        IMAGETYPE_JPEG => @imagecreatefromjpeg($inputPath),
        IMAGETYPE_PNG => @imagecreatefrompng($inputPath),
        IMAGETYPE_WEBP => @imagecreatefromwebp($inputPath),
    };
    if ($image === false) {
        return false;
    }

    $scale = min(1, LISTING_PHOTO_MAX_EDGE / max($info[0], $info[1]));
    $width = max(1, (int) round($info[0] * $scale));
    $height = max(1, (int) round($info[1] * $scale));
    $canvas = imagecreatetruecolor($width, $height);
    if ($canvas === false) {
        return false;
    }
    imagealphablending($canvas, false);
    imagesavealpha($canvas, true);
    imagefill($canvas, 0, 0, imagecolorallocatealpha($canvas, 0, 0, 0, 127));
    if (!imagecopyresampled($canvas, $image, 0, 0, 0, 0, $width, $height, $info[0], $info[1])) {
        return false;
    }
    unset($image);

    if ($info[2] === IMAGETYPE_JPEG && function_exists('exif_read_data')) {
        $orientation = (int) (@exif_read_data($inputPath)['Orientation'] ?? 1);
        if (in_array($orientation, [2, 5, 7], true)) {
            imageflip($canvas, IMG_FLIP_HORIZONTAL);
        } elseif ($orientation === 4) {
            imageflip($canvas, IMG_FLIP_VERTICAL);
        }
        $rotation = match ($orientation) {
            3 => 180,
            5, 8 => 90,
            6, 7 => -90,
            default => 0,
        };
        if ($rotation !== 0) {
            $rotated = imagerotate($canvas, $rotation, 0);
            if ($rotated === false) {
                return false;
            }
            $canvas = $rotated;
        }
    }

    return imagewebp($canvas, $outputPath, LISTING_PHOTO_WEBP_QUALITY)
        && (@getimagesize($outputPath)[2] ?? null) === IMAGETYPE_WEBP;
}
