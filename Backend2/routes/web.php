<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VideoStreamController;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/stream/{filename}', [VideoStreamController::class,'stream']);

Route::get('/run-seed', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'Database\\Seeders\\MasterDemoSeeder', '--force' => true]);
        return 'Database seeded successfully!';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage() . ' | Line: ' . $e->getLine() . ' | File: ' . $e->getFile();
    }
});
