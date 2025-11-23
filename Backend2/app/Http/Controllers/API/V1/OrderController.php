<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function create(Request $r) {
        // For dev: get user id from request or use guest (null)
        $userId = $r->user()?->id;
        $cartItems = CartItem::when($userId, fn($q)=>$q->where('user_id',$userId))->get();
        if ($cartItems->isEmpty()) return response()->json(['message'=>'cart empty'],400);
        $total = $cartItems->sum(fn($c)=> $c->quantity * $c->price_at_add);
    
        DB::beginTransaction();
        try {
          $order = Order::create(['user_id'=>$userId,'total_amount'=>$total,'status'=>'pending']);
          foreach($cartItems as $ci){
            OrderItem::create([
              'order_id'=>$order->id,
              'product_id'=>$ci->product_id,
              'quantity'=>$ci->quantity,
              'unit_price'=>$ci->price_at_add
            ]);
          }
          // clear cart
          if ($userId) CartItem::where('user_id',$userId)->delete();
          DB::commit();
          return response()->json($order,201);
        } catch (\Throwable $e) {
          DB::rollBack();
          return response()->json(['error'=> $e->getMessage()],500);
        }
      }
}
