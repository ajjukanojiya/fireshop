<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\V1\ProductController;
use App\Http\Controllers\API\V1\CartController;
use App\Http\Controllers\API\V1\OrderController;
use App\Http\Controllers\API\V1\AuthController;
use App\Http\Controllers\API\V1\GoogleAuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix('v1')->group(function(){
    Route::get('products',[ProductController::class,'index']);
    Route::get('products/{id}',[ProductController::class,'show']);
  
    Route::get('cart',[CartController::class,'index']);
    Route::post('cart/add',[CartController::class,'add']);
    Route::delete('cart/{id}',[CartController::class,'remove']);
  
    Route::post('orders/create',[OrderController::class,'create']);
  });

  Route::prefix('v1')->group(function(){
    Route::post('auth/send-otp',[AuthController::class,'sendOtp']);
    Route::post('auth/verify-otp',[AuthController::class,'verifyOtp']);
    Route::post('auth/google',[GoogleAuthController::class,'loginWithGoogle']);
  });