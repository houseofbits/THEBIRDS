<?php

$files = scandir("names");
$fileIndex = [];
if($files){
    $index = 0;
    foreach($files as $file){
        if($file != '.' && $file != '..'){
            $fileIndex[$index] = mb_strtolower($file);
        }
    }
}

$content = file_get_contents('vitr7.xhtml');

preg_match_all('/(<span\s+class\=\"T1\">(.*?)<\/span>)|(<span\s+class\=\"T\d\">(.*?)<\/span>)/', $content, $matches);

if(isset($matches[2])){
    $data = [];
    $pos = 0;
    $index = 0;
    for($i=0; $i<count($matches[2]); $i++){
        if(!empty($matches[2][$i])){
            $pos++;
            $data[$pos] = [];
            $data[$pos]['id'] = 0;
            $data[$pos]['title'] = trim($matches[2][$i]);
            $index = 1;

            foreach($fileIndex as $key=>$name){
                if($name == mb_strtolower($data[$pos]['title'])){
                    $data[$pos]['id'] = $key;                        
                    break;
                }
            }

        }else{
            if(!empty(trim($matches[4][$i]))){
                $str = trim($matches[4][$i]);
                switch($index){
                    case 1:
                        $data[$pos]['latin'] = $str;
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
    
    //print_r($data);

    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

}


