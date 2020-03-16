<?php

$id = '10';

$descrFile="desc/".$id.".xhtml";
$mappingFileName = "desc/".$id.".txt";

$fileIndex = file($mappingFileName, FILE_IGNORE_NEW_LINES);
$content = file_get_contents($descrFile);

preg_match_all('/(<h3\s+class\=\".*?\">(.*?)<\/h3>)|(<p\s+class\=\"Standard\">(.*?)<\/p>)/su', $content, $matches);

if(isset($matches[2])){
    $failedIndices = 0;
    $data = [];
    $pos = -1;
    $index = 0;
    for($i=0; $i<count($matches[2]); $i++){
        if(!empty($matches[2][$i])){
            $pos++;
            $data[$pos] = [];
            $data[$pos]['id'] = -1;
            $data[$pos]['title'] = strip_tags(trim($matches[2][$i]));
            $index = 1;
        }else{
            $str = strip_tags(trim($matches[4][$i]));
            $str = str_replace(array("\n", "\r"), '', $str);
            $str = str_replace(array("\t"), ' ', $str);            
            if(!empty($str)){
                switch($index){
                    case 1:
                        $data[$pos]['latin'] = $str;

                        $nameLatin = strtolower(str_replace(' ','_', $str));
                        if($fileIndex){
                            foreach($fileIndex as $key=>$filename){
                                if(strpos(strtolower($filename), $nameLatin) !== false){
                                    $data[$pos]['id'] = $key;                        
                                }
                            }
                            if($data[$pos]['id'] < 0){
                                echo $nameLatin."\n";
                            }
                        }          
                        if($data[$pos]['id'] < 0){
                            $failedIndices++;
                        }

                        $index++;                                            
                    break;
                    case 2:
                        $data[$pos]['rus'] = $str;
                        $index++;                                            
                    break;
                    case 3:
                        $data[$pos]['eng'] = $str;
                        $index++;                                            
                    break;       
                    case 4:
                        $data[$pos]['description'] = $str;
                        $index++;                                            
                    break;                                
                    case 5:
                        $data[$pos]['description'] .= $str;                     
                    break;
                };
                
            }
        }

    }

    //echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    echo "\n\n";
    echo "Entries ".count($data)."\n";    
    echo "Failed indices ".$failedIndices."\n";

    if($failedIndices == 0){
        
        echo "\n\n";

        $content = file_get_contents("config.json");
        $configData = json_decode($content, true);

        foreach($data as $k=>$value){

            $key = $value['id'];

            if(!isset($configData['sectors'][$key])){
                echo "[".$key."] No index in config data \n";    
                exit;
            }

            $configData['sectors'][$key]['titleLatin'] = $value['latin'];
            $configData['sectors'][$key]['title']['lv'] = $value['title'];            
            $configData['sectors'][$key]['title']['ru'] = $value['rus'];            
            $configData['sectors'][$key]['title']['en'] = $value['eng'];                        
            $configData['sectors'][$key]['description']['lv'] = $value['description'];                      
            $configData['sectors'][$key]['main']['iconImage'] = "resources/view_".$id."/images/s".($key+1)."d.png";                                    
            $configData['sectors'][$key]['main']['iconShadow'] = "resources/view_".$id."/images/s".($key+1)."s.png";                                   
            $configData['sectors'][$key]['detailImage']['image'] = "resources/view_".$id."/images/s".($key+1)."d.png";                                                             
        }

        //print_r($configData);

        $configData = json_encode($configData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        if(file_put_contents("configOut.json", $configData)){
            
            echo "\n\nDone!\n";

        }
    }
    
}


