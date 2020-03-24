<?php

$inputFile="input/config.json";

$content = file_get_contents($inputFile);
$configData = json_decode($content, true);



foreach ($configData['sectors'] as $k=>$v) {




}

echo json_encode($configData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

