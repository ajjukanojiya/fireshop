<?php
$env = file_get_contents(__DIR__.'/.env');
preg_match('/GEMINI_API_KEY=(.*)/', $env, $m);
$key = trim($m[1]);
$data = file_get_contents("https://generativelanguage.googleapis.com/v1beta/models?key=" . $key);
$json = json_decode($data, true);
foreach($json['models'] as $model) {
    echo $model['name'] . "\n";
}
