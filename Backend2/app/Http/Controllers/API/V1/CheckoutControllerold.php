<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

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
}
