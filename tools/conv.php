<?php

$descrFile="desc/vitr10.xhtml";
$mappingFileName = 'list.txt';

$fileIndex = file($mappingFileName, FILE_IGNORE_NEW_LINES);
$content = file_get_contents($descrFile);

preg_match_all('/(<span\s+class\=\"T1\">(.*?)<\/span>)|(<span\s+class\=\"T\d+\">(.*?)<\/span>)/', $content, $matches);

if(isset($matches[2])){
    $failedIndices = 0;
    $data = [];
    $pos = 0;
    $index = 0;
    for($i=0; $i<count($matches[2]); $i++){
        if(!empty($matches[2][$i])){
            $pos++;
            $data[$pos] = [];
            $data[$pos]['id'] = -1;
            $data[$pos]['title'] = trim($matches[2][$i]);
            $index = 1;
        }else{
            if(!empty(trim($matches[4][$i]))){
                $str = trim($matches[4][$i]);
                switch($index){
                    case 1:
                        $data[$pos]['latin'] = $str;

                        $name = strtolower(str_replace(' ','_'<$str));
                        if($fileIndex){
                            foreach($fileIndex as $key=>$filename){
                                if(strpos($filename, $name) !== false){
                                    $data[$pos]['id'] = $key;                        
                                }
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

    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    echo "\n\n";
    echo "Entries ".count($data)."\n";    
    echo "Failed indices ".$failedIndices."\n";

}


