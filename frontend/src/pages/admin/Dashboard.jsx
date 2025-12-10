import React, { useEffect, useState } from 'react';
import api from '../../api/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        total_sales: 0,
        total_orders: 0,
        pending_orders: 0,
        low_stock_products: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get('/admin/dashboard');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div className="text-center p-10 text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <p className="text-sm text-gray-500 uppercase font-semibold">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₹ {stats.total_sales.toLocaleString()}</p>
                    <div className="mt-4 text-xs text-green-600 font-medium">+15% from last month</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <p className="text-sm text-gray-500 uppercase font-semibold">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_orders}</p>
                    <p className="mt-4 text-xs text-gray-400">Lifetime orders</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <p className="text-sm text-gray-500 uppercase font-semibold">Pending Orders</p>
                    <p className="text-3xl font-bold text-orange-500 mt-2">{stats.pending_orders}</p>
                    <p className="mt-4 text-xs text-orange-600 font-medium">Needs attention</p>
                </div>
            </div>

            {/* Low Stock Alert */}
            {stats.low_stock_products.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
                        <h3 className="font-bold text-red-800 flex items-center gap-2">
                            ⚠️ Low Stock Alert
                            <span className="bg-red-200 text-red-800 text-xs px-2 py-0.5 rounded-full">{stats.low_stock_products.length} Items</span>
                        </h3>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Product Name</th>
                                    <th className="px-6 py-3 text-right">Stock Left</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.low_stock_products.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{p.title}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-bold text-xs">{p.stock}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-blue-600 hover:underline">Restock</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
