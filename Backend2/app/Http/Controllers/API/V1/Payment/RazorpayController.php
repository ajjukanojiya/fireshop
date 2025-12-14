<?php

namespace App\Http\Controllers\API\V1\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Razorpay\Api\Api;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use App\Models\PaymentTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Mail\OrderPlaced;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class RazorpayController extends Controller
{
    private $api;

    public function __construct()
    {
        $key = config('services.razorpay.key');
        $secret = config('services.razorpay.secret');
        $this->api = new Api($key, $secret);
    }

    // Step 1: Create Razorpay Order
    public function createOrder(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
        ]);

        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }

            // Create Razorpay order
            $razorpayOrder = $this->api->order->create([
                'amount' => $request->amount * 100, // Convert to paise
                'currency' => 'INR',
                'receipt' => 'order_' . time(),
            ]);

            return response()->json([
                'order_id' => $razorpayOrder['id'],
                'amount' => $razorpayOrder['amount'],
                'currency' => $razorpayOrder['currency'],
                'key' => config('services.razorpay.key'),
            ]);
        } catch (\Exception $e) {
            Log::error('Razorpay Order Creation Failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create payment order'], 500);
        }
    }

    // Step 2: Verify Payment and Create Order
    public function verifyPayment(Request $request)
    {
        $request->validate([
            'razorpay_order_id' => 'required',
            'razorpay_payment_id' => 'required',
            'razorpay_signature' => 'required',
            'address' => 'required|array',
            'address.street' => 'required|string',
            'address.city' => 'required|string',
            'address.zip' => 'required|string',
        ]);

        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }

            // Verify signature
            $attributes = [
                'razorpay_order_id' => $request->razorpay_order_id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature,
            ];

            $this->api->utility->verifyPaymentSignature($attributes);

            // Fetch payment details from Razorpay
            $paymentDetails = null;
            try {
                $paymentDetails = $this->api->payment->fetch($request->razorpay_payment_id);
            } catch (\Exception $e) {
                Log::warning('Failed to fetch payment details: ' . $e->getMessage());
            }

            // Signature verified, create order
            $cartItems = CartItem::where('user_id', $user->id)->with('product')->get();

            if ($cartItems->isEmpty()) {
                return response()->json(['message' => 'Cart is empty'], 422);
            }

            return DB::transaction(function() use($user, $cartItems, $request, $paymentDetails) {
                // Calculate total
                $total = 0;
                foreach ($cartItems as $ci) {
                    if (!$ci->product) {
                        throw new \Exception("Product not found for cart item {$ci->id}");
                    }
                    if ($ci->product->stock < $ci->quantity) {
                        throw new \Exception("Insufficient stock for product: {$ci->product->title}");
                    }
                    $total += $ci->product->price * $ci->quantity;
                }

                // Update user address
                $user->update([
                    'name' => $request->address['name'] ?? $user->name,
                    'phone' => $request->address['phone'] ?? $user->phone,
                    'street' => $request->address['street'] ?? $user->street,
                    'city' => $request->address['city'] ?? $user->city,
                    'zip' => $request->address['zip'] ?? $user->zip,
                ]);

                $fullAddress = sprintf(
                    "%s, %s, %s, %s, Contact: %s",
                    $request->address['street'],
                    $request->address['city'],
                    $request->address['zip'],
                    $request->address['name'] ?? $user->name,
                    $request->address['phone'] ?? $user->phone
                );

                // Create order
                $order = Order::create([
                    'user_id' => $user->id,
                    'total_amount' => $total,
                    'status' => 'pending',
                    'address' => $fullAddress,
                    'payment_method' => 'razorpay',
                    'payment_id' => $request->razorpay_payment_id,
                ]);

                // Create order items
                foreach ($cartItems as $ci) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $ci->product_id,
                        'quantity' => $ci->quantity,
                        'price' => $ci->product->price,
                        'meta' => $ci->meta ?? null,
                    ]);

                    $ci->product->decrement('stock', $ci->quantity);
                }

                // **NEW: Log Payment Transaction**
                $gatewayFee = 0;
                $paymentMethod = 'unknown';
                $cardNetwork = null;
                $bank = null;

                if ($paymentDetails) {
                    // Calculate gateway fee (Razorpay charges ~2% + GST)
                    $gatewayFee = ($total * 0.02); // 2% fee
                    $gstOnFee = $gatewayFee * 0.18; // 18% GST on fee
                    
                    $paymentMethod = $paymentDetails->method ?? 'unknown';
                    $cardNetwork = $paymentDetails->card['network'] ?? null;
                    $bank = $paymentDetails->bank ?? null;
                } else {
                    $gstOnFee = 0;
                }

                PaymentTransaction::create([
                    'order_id' => $order->id,
                    'user_id' => $user->id,
                    'payment_gateway' => 'razorpay',
                    'payment_id' => $request->razorpay_payment_id,
                    'order_id_gateway' => $request->razorpay_order_id,
                    'signature' => $request->razorpay_signature,
                    'amount' => $total,
                    'gateway_fee' => $gatewayFee,
                    'gst_on_fee' => $gstOnFee ?? 0,
                    'net_amount' => $total - $gatewayFee - ($gstOnFee ?? 0),
                    'currency' => 'INR',
                    'status' => 'success',
                    'payment_method' => $paymentMethod,
                    'card_network' => $cardNetwork,
                    'bank' => $bank,
                    'gateway_response' => $paymentDetails ? $paymentDetails->toArray() : null,
                    'customer_email' => $user->email,
                    'customer_phone' => $user->phone,
                ]);

                // Clear cart
                CartItem::where('user_id', $user->id)->delete();

                // Load relations
                $order->load(['items.product']);

                // Send email
                try {
                    Mail::to($user)->send(new OrderPlaced($order));
                } catch (\Exception $e) {
                    Log::error('Order Email Failed: ' . $e->getMessage());
                }

                return response()->json([
                    'message' => 'Payment verified and order placed successfully',
                    'order' => $order
                ], 201);
            }, 5);

        } catch (\Razorpay\Api\Errors\SignatureVerificationError $e) {
            // Log failed payment attempt
            try {
                PaymentTransaction::create([
                    'user_id' => Auth::id(),
                    'payment_gateway' => 'razorpay',
                    'payment_id' => $request->razorpay_payment_id,
                    'order_id_gateway' => $request->razorpay_order_id,
                    'signature' => $request->razorpay_signature,
                    'amount' => 0,
                    'status' => 'failed',
                    'error_code' => 'SIGNATURE_VERIFICATION_FAILED',
                    'error_description' => $e->getMessage(),
                ]);
            } catch (\Exception $logError) {
                Log::error('Failed to log payment error: ' . $logError->getMessage());
            }

            return response()->json(['message' => 'Payment verification failed'], 400);
        } catch (\Exception $e) {
            Log::error('Payment Verification Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to process payment', 'error' => $e->getMessage()], 500);
        }
    }
}
