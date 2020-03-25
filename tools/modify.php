<?php

$inputFile="data/config.json";

$content = file_get_contents($inputFile);
$configData = json_decode($content, true);

$content = file_get_contents("data/sounds7.json");
$soundData = json_decode($content, true);

foreach ($configData['sectors'] as $k=>$v) {

    $srcName = $v['title']['lv'];
    $srcName = mb_strtolower(str_replace(' ', '_', $srcName));

    $sounds = [];

    foreach ($soundData as $sk=>$sound){

        if(strpos($sound['title']['lv'], $srcName) !== false){
            $sounds[] = $sound;
            unset($soundData[$sk]);
        }
    }

    $configData['sectors'][$k]['audio'] = $sounds;
}

if(!empty($soundData)) {
    print_r($soundData);
} else {
    echo json_encode($configData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

