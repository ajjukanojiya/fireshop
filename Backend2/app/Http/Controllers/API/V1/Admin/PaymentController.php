<?php

namespace App\Http\Controllers\API\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Delivery;
use App\Models\Settlement;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    // List all COD transaction history
    public function index(Request $request)
    {
        $query = Delivery::with('order', 'deliveryBoy')
            ->whereNotNull('collected_amount')
            ->where('collected_amount', '>', 0)
            ->latest();

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('date')) {
            $query->whereDate('created_at', $request->date);
        }

        $transactions = $query->paginate(20);
        return response()->json($transactions);
    }

    // Wallet Overview: Cash In Hand for each Delivery Boy
    public function wallet(Request $request)
    {
        // Get all delivery boys
        $deliveryBoys = User::where('role', 'delivery_boy')->get();

        $walletData = $deliveryBoys->map(function($user) {
            // Total Collected
            $collected = Delivery::where('user_id', $user->id)->sum('collected_amount');
            
            // Total Settled (Handed to Admin)
            $settled = Settlement::where('user_id', $user->id)->sum('amount');
            
            $cashInHand = $collected - $settled;

            return [
                'user_id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
                'total_collected' => $collected,
                'total_settled' => $settled,
                'cash_in_hand' => $cashInHand
            ];
        });

        return response()->json(['data' => $walletData]);
    }

    // Record a Settlement (Admin receives cash)
    public function storeSettlement(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:1',
            'notes' => 'nullable|string'
        ]);

        $settlement = Settlement::create([
            'user_id' => $request->user_id,
            'amount' => $request->amount,
            'notes' => $request->notes
        ]);

        return response()->json(['message' => 'Settlement recorded successfully', 'data' => $settlement]);
    }

    // History of Settlements
    public function settlementHistory(Request $request)
    {
        $query = Settlement::with('user')->latest();
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        return response()->json($query->paginate(20));
    }
}
