<?php

namespace App\Http\Controllers\API\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Refund;
use App\Models\Order;
use App\Models\User;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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

        $refund = Refund::with('order')->findOrFail($id);
        
        DB::transaction(function() use ($refund, $request) {
            $refund->update([
                'status' => $request->status,
                'admin_note' => $request->admin_note
            ]);

            // If approved, credit to wallet
            if ($request->status === 'approved') {
                // Update Order Status
                $refund->order->update(['status' => 'refunded']);

                $user = User::find($refund->order->user_id);
                if ($user) {
                    $amount = $refund->amount;
                    $user->wallet_balance += $amount;
                    $user->save();

                    WalletTransaction::create([
                        'user_id' => $user->id,
                        'amount' => $amount,
                        'type' => 'refund',
                        'description' => 'Refund for Order #' . $refund->order_id
                    ]);

                    // SMS Notifications disabled due to Twilio compatibility issues
                    // To enable: Configure Twilio credentials in .env and uncomment below code
                    /*
                    try {
                        if ($user && $user->phone && config('services.twilio.sid') && config('services.twilio.token')) {
                            $message = "Refund Approved! Rs.{$refund->amount} has been credited to your Fireshop Wallet for Order #{$refund->order_id}. Use it for your next purchase!";
                            $twilio = new \Twilio\Rest\Client(config('services.twilio.sid'), config('services.twilio.token'));
                            $twilio->messages->create($user->phone, ['from' => config('services.twilio.from'), 'body' => $message]);
                        }
                    } catch (\Exception $e) {
                         \Illuminate\Support\Facades\Log::error('Refund SMS Failed: ' . $e->getMessage());
                    }
                    */
                }
            }
        });

        return response()->json(['message' => 'Refund status updated', 'data' => $refund], 200);
    }
}
