import React, { useEffect, useState } from 'react';
import api from '../../api/api';

export default function AdminReports() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const res = await api.get('/admin/reports');
            setStats(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Reports...</div>;
    if (!stats) return <div className="p-10 text-center">Failed to load reports.</div>;

    // Calculate max value for charts
    const maxSales = Math.max(...stats.sales_trend.map(d => Number(d.amount)), 1);

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Operational Reports</h2>

            {/* 1. Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 uppercase font-semibold">Net Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₹ {Number(stats.summary.revenue).toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">After Refunds</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 bg-red-50">
                    <p className="text-sm text-red-600 uppercase font-semibold">Total Refunded</p>
                    <p className="text-3xl font-bold text-red-700 mt-2">₹ {Number(stats.summary.refunded || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 uppercase font-semibold">Total Cost (Product Cost)</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">₹ {Number(stats.summary.cost).toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">Based on 'Cost Price' set in products</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 bg-gradient-to-br from-white to-green-50">
                    <p className="text-sm text-gray-500 uppercase font-semibold">Net Profit</p>
                    <p className="text-3xl font-bold text-green-700 mt-2">₹ {Number(stats.summary.profit).toLocaleString()}</p>
                    <div className="mt-2 text-xs font-medium text-green-800 bg-green-200 w-fit px-2 py-1 rounded">
                        Margin: {stats.summary.revenue > 0 ? ((stats.summary.profit / stats.summary.revenue) * 100).toFixed(1) : 0}%
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 2. Sales Trend Chart (CSS) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6">Sales Trend (Last 30 Days)</h3>
                    <div className="flex items-end gap-2 h-64 w-full overflow-x-auto pb-2">
                        {stats.sales_trend.map(day => (
                            <div key={day.date} className="group relative flex-1 min-w-[20px] bg-purple-100 hover:bg-purple-200 rounded-t transition-all flex flex-col justify-end items-center" style={{ height: `${(day.amount / maxSales) * 100}%` }}>
                                <div className="w-full bg-purple-500 rounded-t h-full opacity-80 group-hover:opacity-100"></div>
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs p-2 rounded z-10 whitespace-nowrap">
                                    {day.date}: ₹{Number(day.amount).toLocaleString()}
                                </div>
                            </div>
                        ))}
                        {stats.sales_trend.length === 0 && <div className="w-full text-center text-gray-400 self-center">No sales data found for this period.</div>}
                    </div>
                </div>

                {/* 3. Top Products */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-6">Top Selling Products</h3>
                    <div className="space-y-4">
                        {stats.top_products.map((p, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-700 truncate w-2/3">{p.title}</span>
                                <span className="text-sm font-bold text-purple-600">{p.total_sold} Sold</span>
                            </div>
                        ))}
                        {stats.top_products.length === 0 && <div className="text-center text-gray-400">No products sold yet.</div>}
                    </div>
                </div>
            </div>

            {/* 4. Payment Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full md:w-1/2">
                <h3 className="font-bold text-gray-800 mb-6">Payment Methods</h3>
                <div className="space-y-3">
                    {stats.payment_stats.map((stat, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                            <span className="uppercase text-xs font-bold text-gray-500">{stat.method}</span>
                            <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                                {/* Simple % based on count sum */}
                                <div className="h-full bg-blue-500" style={{ width: `${(stat.count / stats.payment_stats.reduce((a, b) => a + Number(b.count), 0)) * 100}%` }}></div>
                            </div>
                            <span className="text-sm font-bold">{stat.count} Orders</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
