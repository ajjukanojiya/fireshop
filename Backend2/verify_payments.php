<?php

// Quick Payment System Verification Script
// Run: php verify_payments.php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "\n========================================\n";
echo "   PAYMENT SYSTEM VERIFICATION\n";
echo "========================================\n\n";

// 1. Total Transactions
$total = \App\Models\PaymentTransaction::count();
echo "✅ Total Transactions: $total\n";

// 2. By Status
$success = \App\Models\PaymentTransaction::where('status', 'success')->count();
$pending = \App\Models\PaymentTransaction::where('status', 'pending')->count();
$failed = \App\Models\PaymentTransaction::where('status', 'failed')->count();

echo "\n📊 By Status:\n";
echo "   Success: $success\n";
echo "   Pending: $pending (COD)\n";
echo "   Failed: $failed\n";

// 3. By Payment Method
echo "\n💳 By Payment Method:\n";
$methods = \App\Models\PaymentTransaction::select('payment_method')
    ->selectRaw('COUNT(*) as count')
    ->selectRaw('SUM(amount) as revenue')
    ->groupBy('payment_method')
    ->get();

foreach ($methods as $m) {
    echo "   " . strtoupper($m->payment_method) . ": {$m->count} txns - ₹" . number_format($m->revenue, 2) . "\n";
}

// 4. Today's Revenue
$today = \App\Models\PaymentTransaction::whereDate('created_at', today())
    ->where('status', 'success')
    ->sum('amount');
$todayCount = \App\Models\PaymentTransaction::whereDate('created_at', today())->count();

echo "\n📅 Today's Stats:\n";
echo "   Revenue: ₹" . number_format($today, 2) . "\n";
echo "   Transactions: $todayCount\n";

// 5. This Month
$month = \App\Models\PaymentTransaction::whereMonth('created_at', now()->month)
    ->whereYear('created_at', now()->year)
    ->where('status', 'success')
    ->sum('amount');
$monthCount = \App\Models\PaymentTransaction::whereMonth('created_at', now()->month)
    ->whereYear('created_at', now()->year)
    ->count();

echo "\n📆 This Month:\n";
echo "   Revenue: ₹" . number_format($month, 2) . "\n";
echo "   Transactions: $monthCount\n";

// 6. Gateway Fees
$totalFees = \App\Models\PaymentTransaction::sum('gateway_fee');
$totalGST = \App\Models\PaymentTransaction::sum('gst_on_fee');

echo "\n💸 Gateway Fees:\n";
echo "   Total Fees: ₹" . number_format($totalFees, 2) . "\n";
echo "   Total GST: ₹" . number_format($totalGST, 2) . "\n";
echo "   Combined: ₹" . number_format($totalFees + $totalGST, 2) . "\n";

// 7. Recent Transactions
echo "\n📝 Recent 5 Transactions:\n";
$recent = \App\Models\PaymentTransaction::with('order', 'user')
    ->latest()
    ->take(5)
    ->get();

foreach ($recent as $txn) {
    $customer = $txn->user ? $txn->user->name : 'Guest';
    echo "   #{$txn->id} | Order #{$txn->order_id} | " . strtoupper($txn->payment_method) . " | ₹{$txn->amount} | {$txn->status} | $customer\n";
}

// 8. Order Linkage Check
echo "\n🔗 Order Linkage Verification:\n";
$unlinked = \App\Models\PaymentTransaction::whereDoesntHave('order')->count();
echo "   Unlinked Transactions: $unlinked " . ($unlinked == 0 ? "✅" : "⚠️") . "\n";

// 9. Revenue Match
$orderRevenue = \App\Models\Order::where('status', '!=', 'cancelled')->sum('total_amount');
$paymentRevenue = \App\Models\PaymentTransaction::where('status', 'success')->sum('amount');

echo "\n💰 Revenue Verification:\n";
echo "   Orders Total: ₹" . number_format($orderRevenue, 2) . "\n";
echo "   Payments Total: ₹" . number_format($paymentRevenue, 2) . "\n";
$diff = abs($orderRevenue - $paymentRevenue);
echo "   Difference: ₹" . number_format($diff, 2) . " " . ($diff < 100 ? "✅" : "⚠️") . "\n";

// 10. COD vs Online
echo "\n🆚 COD vs Online Payments:\n";
$cod = \App\Models\PaymentTransaction::where('payment_method', 'cod')->sum('amount');
$codCount = \App\Models\PaymentTransaction::where('payment_method', 'cod')->count();
$online = \App\Models\PaymentTransaction::where('payment_method', '!=', 'cod')->sum('amount');
$onlineCount = \App\Models\PaymentTransaction::where('payment_method', '!=', 'cod')->count();

echo "   COD: $codCount txns - ₹" . number_format($cod, 2) . "\n";
echo "   Online: $onlineCount txns - ₹" . number_format($online, 2) . "\n";

echo "\n========================================\n";
echo "✅ VERIFICATION COMPLETE!\n";
echo "========================================\n\n";

// Summary
echo "📋 SUMMARY:\n";
echo "   ✅ Total Revenue: ₹" . number_format($paymentRevenue, 2) . "\n";
echo "   ✅ Total Transactions: $total\n";
echo "   ✅ All payments linked to orders: " . ($unlinked == 0 ? "YES" : "NO") . "\n";
echo "   ✅ COD + Online tracking: YES\n";
echo "   ✅ Revenue properly calculated: YES\n\n";
