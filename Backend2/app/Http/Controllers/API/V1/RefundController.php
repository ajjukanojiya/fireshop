<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Refund;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class RefundController extends Controller
{
    // User: Request a refund
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'reason' => 'required|string|max:255',
            'images.*' => 'nullable|image|max:2048' // Validate images
        ]);

        $user = Auth::user();
        $order = Order::where('id', $request->order_id)->where('user_id', $user->id)->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found or unauthorized'], 403);
        }

        if ($order->status !== 'delivered') {
            return response()->json(['message' => 'Only delivered orders can be refunded'], 422);
        }

        // Check if refund already exists
        if (Refund::where('order_id', $order->id)->exists()) {
            return response()->json(['message' => 'Refund request already submitted for this order'], 422);
        }

        $imageUrls = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('refunds', 'public');
                $imageUrls[] = url('storage/' . $path);
            }
        }

        $refund = Refund::create([
            'order_id' => $order->id,
            'amount' => $order->total_amount,
            'reason' => $request->reason,
            'status' => 'pending',
            'images' => $imageUrls
        ]);

        return response()->json(['message' => 'Refund request submitted', 'data' => $refund], 201);
    }
}
