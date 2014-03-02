<?php

//if(!isset($_REQUEST['action'])) exit;

if(isset($_GET['action']) && $_GET['action'] == "retrieve"){
    //read
    $file = findCurrentFile();
    $ideas = array();
    if($file != null){
        $ideas = unserialize(file_get_contents("./data/$file"));
        if(!is_array($ideas)){
            $ideas = array();
        }
    }
    echo json_encode($ideas);
    exit;
}
if(isset($_POST['action']) && $_POST['action'] == "store" && isset($_POST['data'])){
    $data = $_POST['data'];
    $ideas = json_decode($data);
    $file = findCurrentFile();
    if($file != null){
        unlink("./data/$file");
    }
    $filename = md5(uniqid(rand(), true));
    file_put_contents("./data/$filename", serialize($ideas));
    exit;
}

function findCurrentFile(){
    $dir = "./data";
    $files = scandir($dir);
    foreach($files as $file)
    {
        if(!strstr($file, '.')){
            return $file;
        }
    }
    return null;
}
?>