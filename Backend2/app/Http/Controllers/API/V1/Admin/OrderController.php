<?php

namespace App\Http\Controllers\API\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Order;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        // Eager load user and delivery info (including the delivery boy user details)
        $query = Order::with(['user', 'delivery.deliveryBoy', 'items.product'])->latest();
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->paginate(10);
        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::with(['user', 'items.product'])->findOrFail($id);
        return response()->json($order);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:pending,processing,shipped,delivered,cancelled']);
        
        $order = Order::findOrFail($id);
        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => 'Order status updated', 'order' => $order]);
    }
}
