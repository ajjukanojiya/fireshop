import React, { useEffect, useState } from 'react';
import api from '../../api/api';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    const loadOrders = async (status = '') => {
        setLoading(true);
        try {
            const url = status ? `/admin/orders?status=${status}` : '/admin/orders';
            const res = await api.get(url);
            setOrders(res.data.data); // paginate 'data'
        } catch (error) {
            console.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders(filter);
    }, [filter]);

    const updateStatus = async (id, newStatus) => {
        if (!window.confirm(`Mark order #${id} as ${newStatus}?`)) return;
        try {
            await api.patch(`/admin/orders/${id}/status`, { status: newStatus });
            // Refresh list
            loadOrders(filter);
        } catch (e) {
            alert("Failed to update status");
        }
    };

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        shipped: 'bg-indigo-100 text-indigo-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Orders Management</h2>
                <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg bg-gray-50 text-sm"
                >
                    <option value="">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-500 font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Payment</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-8">Loading orders...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-8">No orders found.</td></tr>
                        ) : orders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono font-medium text-gray-900">#{order.id}</td>
                                <td className="px-6 py-4">
                                    <p className="font-medium text-gray-900">{order.user?.name || order.user?.phone || 'Guest'}</p>
                                    <p className="text-xs text-gray-500">{order.user?.email}</p>
                                </td>
                                <td className="px-6 py-4 font-medium">₹ {order.total_amount.toLocaleString()}</td>
                                <td className="px-6 py-4 uppercase text-xs font-bold text-gray-500">{order.payment_id ? 'Paid' : 'COD'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${statusColors[order.status] || 'bg-gray-100'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <select
                                        className="text-xs border rounded px-2 py-1 bg-white hover:border-gray-400 cursor-pointer"
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
