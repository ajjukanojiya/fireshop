<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VideoStreamController;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/stream/{filename}', [VideoStreamController::class,'stream']);

Route::get('/run-seed', function () {
    \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
    return 'Database seeded successfully!';
});
