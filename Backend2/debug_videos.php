<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Product;

$product = Product::with('videos')->find(1);
if ($product) {
    echo "Product: " . $product->title . "\n";
    echo "Videos Count: " . $product->videos->count() . "\n";
    foreach ($product->videos as $v) {
        echo "- ID: {$v->id}, URL: {$v->url}\n";
    }
} else {
    echo "Product 1 not found.\n";
}
