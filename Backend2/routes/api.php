<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\V1\ProductController;
use App\Http\Controllers\API\V1\CartController;
use App\Http\Controllers\API\V1\OrderController;
use App\Http\Controllers\API\V1\AuthController;
use App\Http\Controllers\API\V1\GoogleAuthController;
use App\Http\Controllers\API\V1\CheckoutController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::get('/auth/me', function (Request $request) {
        return response()->json(['user' => $request->user()]);
    });
});


Route::prefix('v1')->group(function(){
    Route::get('products',[ProductController::class,'index']);
    Route::get('products/{id}',[ProductController::class,'show']);
    Route::post('checkout/guest', [CheckoutController::class,'guestCheckout']);
    // Route::get('cart',[CartController::class,'index']);
    // Route::post('cart/add',[CartController::class,'add']);
    // Route::delete('cart/{id}',[CartController::class,'remove']);

 
  });

 Route::prefix('v1')->middleware('auth:sanctum')->group(function(){
    Route::get('cart', [CartController::class,'index']);
    Route::post('cart/add', [CartController::class,'add']);
    Route::patch('cart/{id}', [CartController::class,'update']);
    Route::delete('cart/{id}', [CartController::class,'remove']);
    Route::post('cart/clear', [CartController::class,'clear']);  
   
  });

  Route::prefix('v1')->group(function(){
    Route::post('auth/send-otp',[AuthController::class,'sendOtp']);
    Route::post('auth/verify-otp',[AuthController::class,'verifyOtp']);
    Route::post('auth/google',[GoogleAuthController::class,'loginWithGoogle']);
  });


 Route::prefix('v1')->middleware('auth:sanctum')->group(function(){
    Route::post('/checkout', [CheckoutController::class, 'checkout']);
    // Orders: user orders list + single order view
    Route::post('orders/create',[OrderController::class,'create']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        Route::get('/order-success/{orderId}', [OrderController::class, 'orderSuccess']);
});