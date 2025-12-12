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
    Route::get('categories', [\App\Http\Controllers\API\V1\CategoryController::class, 'index']);
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
    Route::get('/orders/{id}/guest', [OrderController::class, 'guestShow']);
  });


// ADMIN ROUTES
Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin'])->group(function() {
    Route::get('/dashboard', [\App\Http\Controllers\API\V1\Admin\DashboardController::class, 'index']);
    
    Route::apiResource('products', \App\Http\Controllers\API\V1\Admin\ProductController::class);
    Route::apiResource('categories', \App\Http\Controllers\API\V1\Admin\CategoryController::class);
    Route::get('reports', [\App\Http\Controllers\API\V1\Admin\ReportController::class, 'index']);
    Route::get('orders', [\App\Http\Controllers\API\V1\Admin\OrderController::class, 'index']);
    Route::get('orders/{id}', [\App\Http\Controllers\API\V1\Admin\OrderController::class, 'show']);
    Route::patch('orders/{id}/status', [\App\Http\Controllers\API\V1\Admin\OrderController::class, 'updateStatus']);

    // Refund Routes (Admin)
    Route::get('refunds', [\App\Http\Controllers\API\V1\Admin\RefundController::class, 'index']);
    Route::get('refunds/{id}', [\App\Http\Controllers\API\V1\Admin\RefundController::class, 'show']);
    Route::patch('refunds/{id}', [\App\Http\Controllers\API\V1\Admin\RefundController::class, 'update']);

    // Delivery Routes (Admin)
    Route::post('deliveries/assign', [\App\Http\Controllers\API\V1\Admin\DeliveryController::class, 'assign']);

    // User Management (Admin) - e.g. Create Delivery Boy
    Route::get('users', [\App\Http\Controllers\API\V1\Admin\UserController::class, 'index']);
    Route::post('users', [\App\Http\Controllers\API\V1\Admin\UserController::class, 'store']);

    // Payments & Wallet (Admin)
    Route::get('payments/transactions', [\App\Http\Controllers\API\V1\Admin\PaymentController::class, 'index']);
    Route::get('payments/wallet', [\App\Http\Controllers\API\V1\Admin\PaymentController::class, 'wallet']);
    Route::post('payments/settle', [\App\Http\Controllers\API\V1\Admin\PaymentController::class, 'storeSettlement']);
    Route::get('payments/settlements', [\App\Http\Controllers\API\V1\Admin\PaymentController::class, 'settlementHistory']);

}); // End Admin Routes

// Delivery Boy Routes (Protected)
Route::prefix('v1/delivery')->middleware(['auth:sanctum'])->group(function() {
    Route::get('my-deliveries', [\App\Http\Controllers\API\V1\Admin\DeliveryController::class, 'myDeliveries']);
    Route::patch('update-status/{id}', [\App\Http\Controllers\API\V1\Admin\DeliveryController::class, 'updateStatus']);
});

// User Refund Routes (Protected)
Route::prefix('v1')->middleware('auth:sanctum')->group(function(){
    Route::post('/refunds', [\App\Http\Controllers\API\V1\RefundController::class, 'store']); // Use Client Controller
    Route::post('/checkout', [CheckoutController::class, 'checkout']);
    // Orders: user orders list + single order view
    Route::post('orders/create',[OrderController::class,'create']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        Route::get('/order-success/{orderId}', [OrderController::class, 'orderSuccess']);
        Route::get('/my-orders', [OrderController::class, 'myOrders']);
        Route::post('orders/create-guest',[OrdersController::class,'createGuest']);

});