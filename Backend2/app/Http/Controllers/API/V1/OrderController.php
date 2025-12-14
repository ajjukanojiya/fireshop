<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{

    public function createGuest(Request $r)
    {
        $r->validate([
            'items' => 'required|array|min:1',
            'total_amount' => 'required|numeric',
            'guest_phone' => 'nullable|string',
            'guest_token' => 'nullable|string'
        ]);

        $guestToken = $r->guest_token ?? Str::uuid()->toString();

        $order = Order::create([
            'user_id' => null,
            'total_amount' => $r->total_amount,
            'status' => $r->status ?? 'pending',
            'guest_token' => $guestToken,
            'guest_phone' => $r->guest_phone ?? null,
        ]);

        foreach ($r->items as $it) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $it['product_id'],
                'quantity' => $it['quantity'] ?? 1,
                'unit_price' => $it['unit_price'] ?? 0,
            ]);
        }

        return response()->json([
            'order' => $order->load('items.product'),
            'guest_token' => $guestToken
        ]);
    }
    
  public function index(Request $request)
  {
      $user = Auth::user();
      $orders = Order::where('user_id', $user->id)
                      ->withCount('items')
                      ->orderBy('created_at', 'desc')
                      ->paginate(20);

      // return as 'orders' to match frontend expectations
      return response()->json(['orders' => $orders]);
  }

  // GET /api/v1/orders/{id}
  public function show($id)
  {
      $user = Auth::user();
      $order = Order::where('id', $id)->where('user_id', $user->id)
                    ->with(['items.product', 'refund'])
                    ->first();

      if (!$order) {
          return response()->json(['message' => 'Order not found'], 404);
      }

      return response()->json(['order' => $order]);
  }

  public function orderSuccess($orderId)
    {
        $user = Auth::user();
        if(!$user) return response()->json(['message'=>'Unauthenticated'], 401);

        $order = Order::with('items.product')->where('id', $orderId)
            ->where('user_id', $user->id)
            ->first();

        if(!$order) return response()->json(['message'=>'Order not found'], 404);

        return response()->json([
            'message' => 'Order details fetched successfully',
            'order' => $order
        ]);
    }

    // Get all orders of the logged-in user
    public function myOrders()
    {
        $user = Auth::user();
        //dd($user);
        if(!$user) return response()->json(['message'=>'Unauthenticated'], 401);

        $orders = Order::with(['items.product', 'refund'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'message' => 'Orders fetched successfully',
            'orders' => $orders,
            'users' => $user,
        ]);
    }

    // Secure guest order view
    public function guestShow($id, Request $request)
    {
        $guestToken = $request->query('guest_token') ?? $request->guest_token;

        if (!$guestToken) {
            return response()->json(['message' => 'Guest token required'], 401);
        }

        $order = Order::with(['items.product'])
            ->where('id', $id)
            ->where('guest_token', $guestToken)
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found or access denied'], 404);
        }

        return response()->json(['order' => $order]);
    }

}
