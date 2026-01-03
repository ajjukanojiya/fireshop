<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\V1\ProductController;
use App\Http\Controllers\API\V1\CartController;
use App\Http\Controllers\API\V1\OrderController;
use App\Http\Controllers\API\V1\AuthController;
use App\Http\Controllers\API\V1\GoogleAuthController;
use App\Http\Controllers\API\V1\CheckoutController;

// Standard V1 Routing
// Full path will be /api/v1/... (since apiPrefix is set to 'api' in bootstrap/app.php)
Route::prefix('v1')->group(function () {

    Route::get('/auth/me', function (Request $request) {
        return response()->json(['user' => $request->user()]);
    })->middleware('auth:sanctum');

    // Public Routes
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{id}', [ProductController::class, 'show']);
    Route::get('categories', [\App\Http\Controllers\API\V1\CategoryController::class, 'index']);
    Route::post('checkout/guest', [CheckoutController::class, 'guestCheckout']);
    Route::post('auth/send-otp', [AuthController::class, 'sendOtp']);
    Route::post('auth/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('auth/google', [GoogleAuthController::class, 'loginWithGoogle']);
    Route::get('/orders/{id}/guest', [OrderController::class, 'guestShow']);

    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('cart', [CartController::class, 'index']);
        Route::post('cart/add', [CartController::class, 'add']);
        Route::patch('cart/{id}', [CartController::class, 'update']);
        Route::delete('cart/{id}', [CartController::class, 'remove']);
        Route::post('cart/clear', [CartController::class, 'clear']);

        Route::post('/refunds', [\App\Http\Controllers\API\V1\RefundController::class, 'store']);
        Route::post('/checkout', [CheckoutController::class, 'checkout']);
        Route::post('orders/create', [OrderController::class, 'create']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        Route::get('/order-success/{orderId}', [OrderController::class, 'orderSuccess']);
        Route::get('/my-orders', [OrderController::class, 'myOrders']);
        Route::get('/wallet', [\App\Http\Controllers\API\V1\WalletController::class, 'index']);

        Route::post('/create-razorpay-order', [\App\Http\Controllers\API\V1\Payment\RazorpayController::class, 'createOrder']);
        Route::post('/verify-razorpay-payment', [\App\Http\Controllers\API\V1\Payment\RazorpayController::class, 'verifyPayment']);
        Route::post('/test-payment-config', [\App\Http\Controllers\API\V1\Payment\RazorpayController::class, 'testPaymentConfig']);

        Route::get('/addresses', [\App\Http\Controllers\API\V1\AddressController::class, 'index']);
        Route::post('/addresses', [\App\Http\Controllers\API\V1\AddressController::class, 'store']);
        Route::put('/addresses/{id}', [\App\Http\Controllers\API\V1\AddressController::class, 'update']);
        Route::delete('/addresses/{id}', [\App\Http\Controllers\API\V1\AddressController::class, 'destroy']);
        Route::post('/addresses/{id}/set-default', [\App\Http\Controllers\API\V1\AddressController::class, 'setDefault']);
    });

    // ADMIN ROUTES
    Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\API\V1\Admin\DashboardController::class, 'index']);
        Route::apiResource('products', \App\Http\Controllers\API\V1\Admin\ProductController::class);
        Route::delete('products/videos/{id}', [\App\Http\Controllers\API\V1\Admin\ProductController::class, 'destroyVideo']);
        Route::apiResource('categories', \App\Http\Controllers\API\V1\Admin\CategoryController::class);
        Route::get('reports', [\App\Http\Controllers\API\V1\Admin\ReportController::class, 'index']);
        Route::get('orders', [\App\Http\Controllers\API\V1\Admin\OrderController::class, 'index']);
        Route::get('orders/{id}', [\App\Http\Controllers\API\V1\Admin\OrderController::class, 'show']);
        Route::patch('orders/{id}/status', [\App\Http\Controllers\API\V1\Admin\OrderController::class, 'updateStatus']);
        Route::get('refunds', [\App\Http\Controllers\API\V1\Admin\RefundController::class, 'index']);
        Route::get('refunds/{id}', [\App\Http\Controllers\API\V1\Admin\RefundController::class, 'show']);
        Route::patch('refunds/{id}', [\App\Http\Controllers\API\V1\Admin\RefundController::class, 'update']);
        Route::post('deliveries/assign', [\App\Http\Controllers\API\V1\Admin\DeliveryController::class, 'assign']);
        Route::get('users', [\App\Http\Controllers\API\V1\Admin\UserController::class, 'index']);
        Route::post('users', [\App\Http\Controllers\API\V1\Admin\UserController::class, 'store']);
        Route::get('payments/transactions', [\App\Http\Controllers\API\V1\Admin\PaymentController::class, 'index']);
        Route::get('payments/wallet', [\App\Http\Controllers\API\V1\Admin\PaymentController::class, 'wallet']);
        Route::post('payments/settle', [\App\Http\Controllers\API\V1\Admin\PaymentController::class, 'storeSettlement']);
        Route::get('payments/settlements', [\App\Http\Controllers\API\V1\Admin\PaymentController::class, 'settlementHistory']);

        Route::prefix('online-payments')->group(function () {
            Route::get('/', [\App\Http\Controllers\API\V1\Admin\OnlinePaymentController::class, 'index']);
            Route::get('/dashboard', [\App\Http\Controllers\API\V1\Admin\OnlinePaymentController::class, 'dashboard']);
            Route::get('/analytics', [\App\Http\Controllers\API\V1\Admin\OnlinePaymentController::class, 'analytics']);
            Route::get('/reconciliation-summary', [\App\Http\Controllers\API\V1\Admin\OnlinePaymentController::class, 'reconciliationSummary']);
            Route::post('/reconcile', [\App\Http\Controllers\API\V1\Admin\OnlinePaymentController::class, 'reconcile']);
            Route::get('/export', [\App\Http\Controllers\API\V1\Admin\OnlinePaymentController::class, 'export']);
            Route::get('/{id}', [\App\Http\Controllers\API\V1\Admin\OnlinePaymentController::class, 'show']);
        });
    });

    // Delivery Boy Routes
    Route::prefix('delivery')->middleware(['auth:sanctum'])->group(function () {
        Route::get('my-deliveries', [\App\Http\Controllers\API\V1\Admin\DeliveryController::class, 'myDeliveries']);
        Route::patch('update-status/{id}', [\App\Http\Controllers\API\V1\Admin\DeliveryController::class, 'updateStatus']);
    });
});