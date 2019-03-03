<?php
if(!isset($_GET['id']))die('no access');
$filePath = 'view_' . intval($_GET['id']) . '.json';
if(file_exists($filePath)){
    header("Content-type: application/json; charset=utf-8");
    readfile($filePath);
    exit;
}else die('not found');

