<?php 

$viewId = 8;
$numIcons = 38;

$data = [
    "mainBackground" => "resources/view_1/images/bg2.png",
    "detailBackground" => "resources/view_1/images/detail-bg.png",
    "circleBackground" => "resources/segment_circle.png",
    'sectors' => [],
];

for($i=1; $i<=$numIcons; $i++){
    $data['sectors'][] = [
        'comment' => '----------------------- S'.$i.' ------------------------------',
        'titleLatin' => '',
        'title' => [
          "lv" => "",
          "ru" => "",
          "en" => ""
        ],
        "description" => [
          "lv" => "",
          "ru" => "",
          "en" => "",
          "transform" => [20,380]
        ],
        "main" => [
          "diameter" => 280,
          "iconTransform" => [300,50,20],
          "iconImage" => "resources/view_".$viewId."/images/s".$i."d.png",
          "iconShadow" => "resources/view_".$viewId."/images/s".$i."s.png"
        ],
        "detailImage" => [
          "image" => "resources/view_".$viewId."/images/s".$i."d.png",
          "transform" => [560,420,0]
        ],
        "audio" => [

        ]        
    ];
}

echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

