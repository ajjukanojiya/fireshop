<?php

namespace App\Http\Controllers\API\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\WalletTransaction;

class WalletController extends Controller
{
    // Get Balance & History
    public function index()
    {
        $user = Auth::user();

        // Ensure wallet balance is a float/number
        $balance = (float) $user->wallet_balance;

        // Get transactions
        $history = WalletTransaction::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'balance' => $balance,
            'history' => $history
        ]);
    }
}
