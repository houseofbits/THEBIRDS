<?php
if(!isset($_GET['id']))die('no access');
$filePath = 'resources/view_' . intval($_GET['id']) . '/config.json';
if(file_exists($filePath)){
    header("Content-type: application/json; charset=utf-8");
    readfile($filePath);
    exit;
}else die('not found');

