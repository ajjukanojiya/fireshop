<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

use Illuminate\Support\Str;
// use Illuminate\Support\Facades\Schema;
// use Illuminate\Support\Facades\DB;
use App\Models\Product;
// use App\Models\Order;
// use App\Models\OrderItem;

class CheckoutController extends Controller
{
    public function checkout(Request $request)
    {
        $request->validate([
            'payment_method' => 'nullable|string|in:cod,upi,card',
            // Simple validation for address fields
            'address' => 'required|array',
            'address.street' => 'required|string',
            'address.city' => 'required|string',
            'address.zip' => 'required|string',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // 1. Update User Profile with new address if provided
        // This ensures next time they login, these fields are available.
        $user->update([
            'name' => $request->address['name'] ?? $user->name,
            'phone' => $request->address['phone'] ?? $user->phone,
            'street' => $request->address['street'] ?? $user->street,
            'city' => $request->address['city'] ?? $user->city,
            'zip' => $request->address['zip'] ?? $user->zip,
        ]);

        // load user's cart items with product relation
        $cartItems = CartItem::where('user_id', $user->id)->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        // transaction to keep things safe
        return DB::transaction(function() use($user, $cartItems, $request) {

            // check stock and calculate total
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

            // Create formatted address string for the Order table
            // (Assuming Order table has a single text 'address' column, or JSON)
            // If it's a string column, we combine them.
            $fullAddress = sprintf(
                "%s, %s, %s, %s, Contact: %s",
                $request->address['street'],
                $request->address['city'],
                $request->address['zip'],
                $request->address['name'] ?? $user->name,
                $request->address['phone'] ?? $user->phone
            );

            // create order
            $orderData = [
                'user_id' => $user->id,
                'total_amount' => $total,
                'status' => 'pending', 
            ];

            if (Schema::hasColumn('orders', 'address')) {
                // If address is json, we can save the array directly, else string
                $orderData['address'] = $fullAddress; 
            }

            if ($request->payment_method && Schema::hasColumn('orders', 'payment_method')) {
                $orderData['payment_method'] = $request->payment_method;
            }
            
            // Save extra payment details (like UPI ID)
            if ($request->payment_details && Schema::hasColumn('orders', 'payment_details')) {
                // ensure it's cast to array/json
                $orderData['payment_details'] = $request->payment_details;
            }

            $order = Order::create($orderData);

            // create order items, decrement stock
            foreach ($cartItems as $ci) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $ci->product_id,
                    'quantity' => $ci->quantity,
                    'price' => $ci->product->price,
                    'meta' => $ci->meta ?? null,
                ]);

                // decrement stock (use decrement to avoid race if needed)
                $ci->product->decrement('stock', $ci->quantity);
            }

            // clear user's cart
            CartItem::where('user_id', $user->id)->delete();

            // eager load items + product for response
            $order->load(['items.product']);

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order
            ], 201);
        }, 5); // 5 retry attempts for deadlocks
    }

    public function guestCheckout_old(Request $r)
    {
        $r->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
            'address' => 'required|string',
            'items' => 'required|array|min:1',
            // items[*].product_id, items[*].quantity validation below optional
        ]);
    
        $items = $r->items;
    
        // calculate total and check stock
        $total = 0;
        foreach ($items as $it) {
            $pid = $it['product_id'] ?? null;
            $qty = intval($it['quantity'] ?? 1);
            if (!$pid) return response()->json(['message'=>'product_id missing in items'], 422);
    
            $product = \App\Models\Product::find($pid);
            if (!$product) return response()->json(['message'=>"Product ID {$pid} not found"], 404);
    
            if ($product->stock < $qty) {
                return response()->json(['message'=>"Insufficient stock for product: {$product->title}"], 422);
            }
            $price = $product->price;
            $total += ($price * $qty);
        }
    
        // create order fields dynamically depending on DB columns
        $orderData = [];
    
        // user_id null for guest
        $orderData['user_id'] = null;
    
        // set total / total_amount depending on schema
        if (Schema::hasColumn('orders','total')) {
            $orderData['total'] = $total;
        }
        if (Schema::hasColumn('orders','total_amount')) {
            $orderData['total_amount'] = $total;
        }
        // fallback if none exist, use 'total' key (may fail if column missing)
        if (!Schema::hasColumn('orders','total') && !Schema::hasColumn('orders','total_amount')) {
            $orderData['total'] = $total;
        }
    
        // status
        if (Schema::hasColumn('orders','status')) $orderData['status'] = 'pending';
        // attach guest fields if present
        if (Schema::hasColumn('orders','name')) $orderData['name'] = $r->name;
        if (Schema::hasColumn('orders','phone')) $orderData['phone'] = $r->phone;
        if (Schema::hasColumn('orders','address')) $orderData['address'] = $r->address;
    
        // create order inside transaction
        $order = DB::transaction(function() use($orderData, $items) {
    
            $order = Order::create($orderData);
    
            // create items and decrement stock
            foreach ($items as $it) {
                $pid = $it['product_id'];
                $qty = intval($it['quantity'] ?? 1);
                $product = \App\Models\Product::find($pid);
                if (!$product) throw new \Exception("Product $pid missing");
    
                // prepare order item data keys according to schema
                $orderItemData = [
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $qty,
                ];
                // use 'price' or 'unit_price' column depending on schema
                if (Schema::hasColumn('order_items','price')) {
                    $orderItemData['price'] = $product->price;
                }
                if (Schema::hasColumn('order_items','unit_price')) {
                    $orderItemData['unit_price'] = $product->price;
                }
                // if meta column exists and incoming item has meta, save it
                if (Schema::hasColumn('order_items','meta') && isset($it['meta'])) {
                    $orderItemData['meta'] = $it['meta'];
                }
    
                OrderItem::create($orderItemData);
    
                // decrement stock safely
                $product->decrement('stock', $qty);
            }
    
            return $order;
        });
    
        return response()->json([
            'message' => 'Guest order placed successfully',
            'order_id' => $order->id
        ], 201);
    }


    public function guestCheckout(Request $r)
{
   // return ('aajja');
    // validate incoming payload (basic). You may extend as needed.
    $r->validate([
        'name' => 'required|string',
        'phone' => 'required|string',
        'address' => 'required|string',
       // 'items' => 'required|array|min:1',
        // 'items.*.product_id' => 'required|integer',
        // 'items.*.quantity' => 'nullable|integer|min:1',
      //  'guest_token' => 'nullable|string' // optional client-supplied token
    ]);

//    dd(111);
   // return($r->phone);
    $items = $r->items;
    $guestPhone = $r->phone;
    $guestToken = $r->guest_token ?? Str::uuid()->toString(); // generate if not provided

    // 1) Check stock and compute total
    $total = 0;
    $productsToUpdate = []; // hold product models to decrement later
    foreach ($items as $it) {
        $pid = $it['product_id'] ?? null;
        $qty = intval($it['quantity'] ?? 1);
        if (!$pid) {
            return response()->json(['message' => 'product_id missing in items'], 422);
        }

        $product = Product::lockForUpdate()->find($pid); // lock row to avoid race
        if (!$product) {
            return response()->json(['message' => "Product ID {$pid} not found"], 404);
        }

        if ($product->stock < $qty) {
            return response()->json(['message' => "Insufficient stock for product: {$product->title}"], 422);
        }

        $price = $product->price ?? 0;
        $total += ($price * $qty);

        $productsToUpdate[] = [
            'product' => $product,
            'qty' => $qty
        ];
    }

    // 2) Prepare order data (schema-flexible)
    $orderData = [];
    $orderData['user_id'] = null; // guest

    // total column name: support both 'total' and 'total_amount'
    if (Schema::hasColumn('orders', 'total_amount')) {
        $orderData['total_amount'] = $total;
    } elseif (Schema::hasColumn('orders', 'total')) {
        $orderData['total'] = $total;
    } else {
        // fallback: set total_amount key (if DB different, this will fail—ensure one column exists)
        $orderData['total_amount'] = $total;
    }

    if (Schema::hasColumn('orders', 'status')) $orderData['status'] = 'pending';
    if (Schema::hasColumn('orders', 'guest_token')) $orderData['guest_token'] = $guestToken;
    if (Schema::hasColumn('orders', 'guest_phone')) $orderData['guest_phone'] = $guestPhone;

    // optional customer details on orders table (if exists)
    // if (Schema::hasColumn('orders', 'name')) $orderData['name'] = $r->name;
    if (Schema::hasColumn('orders', 'address')) $orderData['address'] = $r->address;

    // Payment Method (cod / upi / card)
    if ($r->payment_method && Schema::hasColumn('orders', 'payment_method')) {
        $orderData['payment_method'] = $r->payment_method;
    }
    
    // Payment Details (save JSON like upi_id etc)
    if ($r->payment_details && Schema::hasColumn('orders', 'payment_details')) {
         $orderData['payment_details'] = $r->payment_details;
    }
    
    // 3) Create order inside DB transaction (safe)
    try {
        $order = DB::transaction(function () use ($orderData, $items, $productsToUpdate) {

            $order = Order::create($orderData);

            foreach ($items as $it) {
                $pid = $it['product_id'];
                $qty = intval($it['quantity'] ?? 1);
                $product = Product::find($pid); // fresh model (we locked earlier)
                if (!$product) throw new \Exception("Product {$pid} missing during order creation");

                // prepare order item payload depending on schema
                $orderItemData = [
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $qty,
                ];
                if (Schema::hasColumn('order_items', 'price')) {
                    $orderItemData['price'] = $product->price;
                }
                if (Schema::hasColumn('order_items', 'unit_price')) {
                    $orderItemData['unit_price'] = $product->price;
                }
                if (Schema::hasColumn('order_items', 'meta') && isset($it['meta'])) {
                    $orderItemData['meta'] = $it['meta'];
                }

                OrderItem::create($orderItemData);
            }

            // decrement stock for each product (use decrements to be safe)
            foreach ($productsToUpdate as $p) {
                $p['product']->decrement('stock', $p['qty']);
            }

            return $order;
        }, 5); // retry attempts for deadlocks

    } catch (\Exception $e) {
        // return a friendly error
        return response()->json(['message' => 'Failed to create order', 'error' => $e->getMessage()], 500);
    }

    // 4) Load items for response if relationship exists
    if (method_exists($order, 'load')) {
        $order->load(['items.product']);
    }

    // 5) Return order id and guest_token (frontend should store guest_token locally)
    return response()->json([
        'message' => 'Guest order placed successfully',
        'order' => $order,
        'guest_token' => $guestToken
    ], 201);
}
}
