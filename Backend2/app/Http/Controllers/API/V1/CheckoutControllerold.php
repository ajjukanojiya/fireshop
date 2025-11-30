<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

class CheckoutController extends Controller
{
    public function checkout(Request $r)
    {
        $user = Auth::user();
        if (!$user) return response()->json(['message'=>'Unauthenticated'], 401);

        $cart = CartItem::where('user_id', $user->id)->with('product')->get();
        if ($cart->isEmpty()) return response()->json(['message'=>'Cart is empty'], 422);

        return DB::transaction(function() use($user, $cart){
            $total = 0;

            foreach($cart as $item){
                if($item->product->stock < $item->quantity){
                    throw new \Exception("Insufficient stock for product: ".$item->product->title);
                }
                $total += $item->product->price * $item->quantity;
            }

            // create order
            $order = Order::create([
                'user_id' => $user->id,
                'total' => $total,
                'status' => 'paid', // assuming payment success for now
            ]);

            foreach($cart as $item){
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price,
                    'meta' => $item->meta,
                ]);

                // reduce stock
                $item->product->decrement('stock', $item->quantity);
            }

            // clear cart
            CartItem::where('user_id', $user->id)->delete();

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order
            ]);
        });
    }

    public function guestCheckout(Request $r)
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
}
