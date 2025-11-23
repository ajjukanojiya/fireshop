<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VideoStreamController;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/stream/{filename}', [VideoStreamController::class,'stream']);
