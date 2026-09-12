<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dir = __DIR__ . '/images';
$allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
$images = [];

if (is_dir($dir)) {
    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file === '.' || $file === '..' || strpos($file, 'images.json') !== false) continue;
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($ext, $allowedExts)) {
            $nameWithoutExt = pathinfo($file, PATHINFO_FILENAME);
            $cleanTitle = ucwords(str_replace(['-', '_'], ' ', $nameWithoutExt));
            $images[] = [
                'filename' => $file,
                'src' => 'images/' . $file,
                'title' => $cleanTitle
            ];
        }
    }
}

echo json_encode($images);
