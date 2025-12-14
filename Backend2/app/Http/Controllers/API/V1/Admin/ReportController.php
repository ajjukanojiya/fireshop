<?php

namespace App\Http\Controllers\API\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\OrderItem;
use App\Models\Refund;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        // 1. Total Profit Logic
        // Gross Revenue = Total Sales
        // Cost = Sum(qty * cost_price)
        // Profit = Revenue - Cost

        $grossRevenue = Order::where('status', '!=', 'cancelled')->sum('total_amount');
        
        // Refunds (Approved)
        $totalRefunded = Refund::where('status', 'approved')->sum('amount');

        // Net Revenue
        $netRevenue = $grossRevenue - $totalRefunded;

        
        // Calculate total cost (only for non-cancelled orders)
        // We join order_items -> products to get cost_price
        $totalCost = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->where('orders.status', '!=', 'cancelled')
            ->select(DB::raw('SUM(order_items.quantity * COALESCE(products.cost_price, 0)) as total_cost'))
            ->value('total_cost');

        $totalProfit = $netRevenue - $totalCost;

        // 2. Sales Trend (Last 30 Days)
        $salesTrend = Order::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(total_amount) as amount'),
            DB::raw('COUNT(*) as count')
        )
        ->where('created_at', '>=', Carbon::now()->subDays(30))
        ->where('status', '!=', 'cancelled')
        ->groupBy('date')
        ->orderBy('date')
        ->get();

        // 3. Payment Method Stats
        // 3. Payment Method Stats
        $paymentStats = Order::select(
            DB::raw('COALESCE(UPPER(payment_method), "UNKNOWN") as method'), 
            DB::raw('count(*) as count')
        )
            ->groupBy('method')
            ->get();

        // 4. Top Selling Products
        $topProducts = DB::table('order_items')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->select('products.title', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->groupBy('products.id', 'products.title')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        return response()->json([
            'summary' => [
                'revenue' => $netRevenue, // Now this is Net Revenue
                'gross_revenue' => $grossRevenue,
                'refunded' => $totalRefunded,
                'cost' => $totalCost,
                'profit' => $totalProfit
            ],
            'sales_trend' => $salesTrend,
            'payment_stats' => $paymentStats,
            'top_products' => $topProducts
        ]);
    }
}
