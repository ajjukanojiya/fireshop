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
                    ->with(['items.product'])
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
    if(!$user) return response()->json(['message'=>'Unauthenticated'], 401);

    $orders = Order::with('items.product')
        ->where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json([
        'message' => 'Orders fetched successfully',
        'orders' => $orders
    ]);
}

}
