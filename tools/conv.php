<?php

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
    
    print_r($data);

}


