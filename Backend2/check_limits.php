<?php
echo "Current upload_max_filesize: " . ini_get('upload_max_filesize') . "\n";
echo "Current post_max_size: " . ini_get('post_max_size') . "\n";
echo "Loaded php.ini: " . php_ini_loaded_file() . "\n";
