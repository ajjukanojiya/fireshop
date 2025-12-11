<?php

namespace App\Http\Controllers\API\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Delivery;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class DeliveryController extends Controller
{
    // Admin: Assign Order to Delivery Boy
    public function assign(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'user_id' => 'required|exists:users,id', // Delivery Boy ID
        ]);

        // Check if already assigned
        $delivery = Delivery::where('order_id', $request->order_id)->first();
        if ($delivery) {
            $delivery->update(['user_id' => $request->user_id, 'status' => 'assigned']);
        } else {
            $delivery = Delivery::create([
                'order_id' => $request->order_id,
                'user_id' => $request->user_id,
                'status' => 'assigned'
            ]);
        }

        return response()->json(['message' => 'Order assigned to delivery boy', 'data' => $delivery]);
    }

    // Delivery Boy: Get My Deliveries
    public function myDeliveries()
    {
        $user = Auth::user();
        $deliveries = Delivery::where('user_id', $user->id)
            ->with(['order.items.product', 'order.user']) // eager load order details
            ->latest()
            ->get();

        return response()->json(['data' => $deliveries]);
    }

    // Delivery Boy: Update Status (e.g. Delivered)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:picked,delivered,failed',
            'proof_image' => 'nullable|string', // URL or Path
            'collected_amount' => 'nullable|numeric|min:0'
        ]);

        $user = Auth::user();
        $delivery = Delivery::where('id', $id)->where('user_id', $user->id)->firstOrFail();

        $delivery->update([
            'status' => $request->status,
            'proof_image' => $request->proof_image ?? $delivery->proof_image,
            'collected_amount' => $request->status == 'delivered' ? $request->collected_amount : null
        ]);

        // Optional: Update main order status too
        if($request->status === 'delivered') {
             $delivery->order->update(['status' => 'delivered']);
             // We can also mark payment as paid if full amount collected, but keeping it simple for now as per plan
        }

        return response()->json(['message' => 'Delivery status updated', 'data' => $delivery]);
    }
}
