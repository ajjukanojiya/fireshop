<?php

namespace App\Http\Controllers\API\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Refund;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;

class RefundController extends Controller
{
    // Admin: List all refunds
    public function index()
    {
        $refunds = Refund::with(['order.user', 'order.items'])->latest()->get();
        return response()->json(['data' => $refunds], 200);
    }

    // User: Request a refund
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'reason' => 'required|string|max:255',
        ]);

        $user = Auth::user();
        $order = Order::where('id', $request->order_id)->where('user_id', $user->id)->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found or unauthorized'], 403);
        }

        // Check if refund already exists
        if (Refund::where('order_id', $order->id)->exists()) {
            return response()->json(['message' => 'Refund request already submitted for this order'], 422);
        }

        $refund = Refund::create([
            'order_id' => $order->id,
            'amount' => $order->total_amount ?? $order->total, // Handle schema fallback
            'reason' => $request->reason,
            'status' => 'pending'
        ]);

        return response()->json(['message' => 'Refund request submitted', 'data' => $refund], 201);
    }

    // Admin: Show specific refund
    public function show($id)
    {
        $refund = Refund::with(['order.items'])->findOrFail($id);
        return response()->json(['data' => $refund], 200);
    }

    // Admin: Approve/Reject
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_note' => 'nullable|string'
        ]);

        $refund = Refund::findOrFail($id);
        $refund->update([
            'status' => $request->status,
            'admin_note' => $request->admin_note
        ]);

        return response()->json(['message' => 'Refund status updated', 'data' => $refund], 200);
    }
}
