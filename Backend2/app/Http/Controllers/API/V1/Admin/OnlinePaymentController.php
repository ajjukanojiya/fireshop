<?php

namespace App\Http\Controllers\API\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PaymentTransaction;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OnlinePaymentController extends Controller
{
    /**
     * Get all online payment transactions with filters
     */
    public function index(Request $request)
    {
        $query = PaymentTransaction::with(['order', 'user'])
            ->latest();

        // Filter by status
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('from_date') && $request->from_date != '') {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->has('to_date') && $request->to_date != '') {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        // Filter by payment method
        if ($request->has('payment_method') && $request->payment_method != '') {
            $query->where('payment_method', $request->payment_method);
        }

        // Filter by reconciliation status
        if ($request->has('is_reconciled') && $request->is_reconciled != '') {
            $query->where('is_reconciled', $request->is_reconciled);
        }

        // Search by payment ID or order ID
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('payment_id', 'like', "%{$search}%")
                  ->orWhere('order_id', $search)
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%")
                                ->orWhere('phone', 'like', "%{$search}%");
                  });
            });
        }

        $transactions = $query->paginate(20);

        return response()->json($transactions);
    }

    /**
     * Get payment dashboard statistics
     */
    public function dashboard(Request $request)
    {
        // Today's stats
        $todaySuccess = PaymentTransaction::today()->success()->sum('amount');
        $todayCount = PaymentTransaction::today()->success()->count();
        $todayFailed = PaymentTransaction::today()->failed()->count();

        // This month stats
        $monthSuccess = PaymentTransaction::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->success()
            ->sum('amount');

        $monthCount = PaymentTransaction::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->success()
            ->count();

        // Total gateway fees collected
        $totalFees = PaymentTransaction::success()->sum('gateway_fee');
        $totalGST = PaymentTransaction::success()->sum('gst_on_fee');

        // Unreconciled payments
        $unreconciledAmount = PaymentTransaction::success()
            ->unreconciled()
            ->sum('amount');
        $unreconciledCount = PaymentTransaction::success()
            ->unreconciled()
            ->count();

        // Payment method breakdown
        $paymentMethods = PaymentTransaction::success()
            ->select('payment_method', DB::raw('count(*) as count'), DB::raw('sum(amount) as total'))
            ->groupBy('payment_method')
            ->get();

        // Recent failed payments
        $recentFailed = PaymentTransaction::failed()
            ->with(['user', 'order'])
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'today' => [
                'revenue' => $todaySuccess,
                'count' => $todayCount,
                'failed' => $todayFailed
            ],
            'month' => [
                'revenue' => $monthSuccess,
                'count' => $monthCount
            ],
            'fees' => [
                'gateway_fee' => $totalFees,
                'gst' => $totalGST,
                'total' => $totalFees + $totalGST
            ],
            'unreconciled' => [
                'amount' => $unreconciledAmount,
                'count' => $unreconciledCount
            ],
            'payment_methods' => $paymentMethods,
            'recent_failed' => $recentFailed
        ]);
    }

    /**
     * Get payment analytics (daily/weekly/monthly trends)
     */
    public function analytics(Request $request)
    {
        $period = $request->get('period', 'daily'); // daily, weekly, monthly
        $days = $request->get('days', 30);

        $dateFormat = match($period) {
            'daily' => '%Y-%m-%d',
            'weekly' => '%Y-%u',
            'monthly' => '%Y-%m',
            default => '%Y-%m-%d'
        };

        $analytics = PaymentTransaction::select(
                DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as period"),
                DB::raw('COUNT(*) as total_transactions'),
                DB::raw('SUM(CASE WHEN status = "success" THEN 1 ELSE 0 END) as successful'),
                DB::raw('SUM(CASE WHEN status = "failed" THEN 1 ELSE 0 END) as failed'),
                DB::raw('SUM(CASE WHEN status = "success" THEN amount ELSE 0 END) as revenue'),
                DB::raw('SUM(CASE WHEN status = "success" THEN gateway_fee ELSE 0 END) as fees')
            )
            ->where('created_at', '>=', Carbon::now()->subDays($days))
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        return response()->json($analytics);
    }

    /**
     * Mark payments as reconciled
     */
    public function reconcile(Request $request)
    {
        $request->validate([
            'payment_ids' => 'required|array',
            'payment_ids.*' => 'exists:payment_transactions,id',
            'settlement_id' => 'nullable|string',
            'settlement_date' => 'nullable|date'
        ]);

        $updated = PaymentTransaction::whereIn('id', $request->payment_ids)
            ->update([
                'is_reconciled' => true,
                'reconciled_at' => now(),
                'settlement_id' => $request->settlement_id,
                'settlement_date' => $request->settlement_date ?? now()->toDateString()
            ]);

        return response()->json([
            'message' => 'Payments reconciled successfully',
            'count' => $updated
        ]);
    }

    /**
     * Get single payment transaction details
     */
    public function show($id)
    {
        $transaction = PaymentTransaction::with(['order.items.product', 'user'])
            ->findOrFail($id);

        return response()->json($transaction);
    }

    /**
     * Export payments to CSV
     */
    public function export(Request $request)
    {
        $query = PaymentTransaction::with(['order', 'user']);

        // Apply same filters as index
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $transactions = $query->get();

        $csvData = [];
        $csvData[] = [
            'Transaction ID',
            'Order ID',
            'Payment ID',
            'Customer Name',
            'Customer Email',
            'Amount',
            'Gateway Fee',
            'Net Amount',
            'Payment Method',
            'Status',
            'Date',
            'Reconciled'
        ];

        foreach ($transactions as $t) {
            $csvData[] = [
                $t->id,
                $t->order_id,
                $t->payment_id,
                $t->user->name ?? 'Guest',
                $t->customer_email,
                $t->amount,
                $t->gateway_fee,
                $t->net_amount,
                $t->payment_method,
                $t->status,
                $t->created_at->format('Y-m-d H:i:s'),
                $t->is_reconciled ? 'Yes' : 'No'
            ];
        }

        $filename = 'payment_transactions_' . now()->format('Y-m-d_His') . '.csv';
        $handle = fopen('php://temp', 'r+');
        
        foreach ($csvData as $row) {
            fputcsv($handle, $row);
        }
        
        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Get reconciliation summary
     */
    public function reconciliationSummary(Request $request)
    {
        $fromDate = $request->get('from_date', now()->subDays(30)->toDateString());
        $toDate = $request->get('to_date', now()->toDateString());

        $summary = PaymentTransaction::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as total_transactions'),
                DB::raw('SUM(CASE WHEN status = "success" THEN amount ELSE 0 END) as total_amount'),
                DB::raw('SUM(CASE WHEN is_reconciled = 1 THEN amount ELSE 0 END) as reconciled_amount'),
                DB::raw('SUM(CASE WHEN is_reconciled = 0 AND status = "success" THEN amount ELSE 0 END) as pending_amount')
            )
            ->whereBetween('created_at', [$fromDate, $toDate])
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($summary);
    }
}
